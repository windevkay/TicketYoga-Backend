import crypto from 'crypto';
import { Response, Request } from 'express';

import { LoginResponse, Viewer, Database, UserEntity } from '../lib/types';

import { ErrorHelper, ErrorType } from './helpers/Error.helper';
import { Google } from './requests';

export class AuthenticationService {
    cookieOptions = {
        httpOnly: true,
        sameSite: true,
        signed: true,
        secure: process.env.NODE_ENV === 'development' ? false : true,
    };
    /**
     * Returns the login URL required for Google OAUTH
     */
    public queryGetGoogleAuthUrl = (): Promise<string> => {
        return Promise.resolve(Google.authUrl());
    };
    /**
     * Mutation to handle user login via google or cookie
     * @param params input(with google auth code string or null) , db
     */
    public mutationLoginWithAuthCode = async (params: {
        input: { code: string } | null;
        db: Database;
        req: Request;
        res: Response;
    }): Promise<Viewer> => {
        const { input, db, req, res } = params;
        const authCode = input ? input.code : null;
        // generate user session token
        const token = crypto.randomBytes(16).toString('hex');

        const user: UserEntity | undefined = authCode
            ? await this.middlewareLoginViaGoogle({ authCode, token, db, res })
            : await this.middlewareLoginViaCookie({ token, db, req, res });

        let viewer: Viewer;
        if (!user) {
            viewer = { didRequest: true };
        } else {
            viewer = {
                _id: user._id,
                token: user.token,
                avatar: user.avatar,
                walletId: user.walletId,
                didRequest: true,
            };
        }
        return Promise.resolve(viewer);
    };
    /**
     * Handles user Logout
     * @param params express response object
     */
    public mutationLogOut = (params: { res: Response }): Viewer => {
        const { res } = params;
        try {
            res.clearCookie('viewer', this.cookieOptions);
            return { didRequest: true };
        } catch (error) {
            return new ErrorHelper().createNewError(ErrorType.ERROR_LOGGING_OUT);
        }
    };
    /**
     * Middleware to handle requesting user details from Google and either updating or creating db user
     * @param params authcode from google, session token and db object
     */
    private middlewareLoginViaGoogle = async (params: {
        authCode: string;
        token: string;
        db: Database;
        res: Response;
    }): Promise<UserEntity | undefined> => {
        const { authCode, token, db, res } = params;
        const { user, googleAccessToken, googleRefreshToken }: LoginResponse = await Google.logIn(authCode);
        if (!user) {
            return new ErrorHelper().createNewError(ErrorType.GOOGLE_USER_ERROR);
        }
        // get user data
        const userNamesList = user.names && user.names.length ? user.names : null;
        const userPhotosList = user.photos && user.photos.length ? user.photos : null;
        const userEmailsList = user.emailAddresses && user.emailAddresses.length ? user.emailAddresses : null;

        const userName = userNamesList ? userNamesList[0].displayName : null;
        const userId =
            userNamesList && userNamesList[0].metadata && userNamesList[0].metadata.source
                ? userNamesList[0].metadata.source.id
                : null;
        const userAvatar = userPhotosList && userPhotosList[0].url ? userPhotosList[0].url : null;
        const userEmail = userEmailsList && userEmailsList[0].value ? userEmailsList[0].value : null;

        if (!userName || !userId || !userAvatar || !userEmail) {
            return new ErrorHelper().createNewError(ErrorType.GOOGLE_USER_ERROR);
        }
        // if user is present in db, then update user
        const updatedUserIfAny = await db.users.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    name: userName,
                    contact: userEmail,
                    avatar: userAvatar,
                    token,
                    googleAccessToken,
                    googleRefreshToken,
                },
            },
            { returnOriginal: false },
        );

        let newOrUpdatedUser: UserEntity | undefined = updatedUserIfAny.value;
        if (!newOrUpdatedUser) {
            const newUser = await db.users.insertOne({
                _id: userId,
                token,
                name: userName,
                avatar: userAvatar,
                contact: userEmail,
                income: 0,
                events: [],
                tickets: [],
                googleAccessToken,
                googleRefreshToken,
            });
            newOrUpdatedUser = newUser.ops[0];
        }
        //set client cookie
        res.cookie('viewer', userId, {
            ...this.cookieOptions,
            maxAge: 365 * 24 * 60 * 60 * 1000, //1 year expiry
        });

        return Promise.resolve(newOrUpdatedUser);
    };

    private middlewareLoginViaCookie = async (params: {
        token: string;
        db: Database;
        req: Request;
        res: Response;
    }): Promise<UserEntity | undefined> => {
        const { token, db, req, res } = params;
        try {
            //find user and update their token information
            const userUpdate = await db.users.findOneAndUpdate(
                {
                    _id: req.signedCookies.viewer,
                },
                { $set: { token } },
                { returnOriginal: false },
            );

            const user = userUpdate.value;
            //if there is no user, clear the cookie as we assume user is no longer available
            if (!user) {
                res.clearCookie('viewer', this.cookieOptions);
            }
            return Promise.resolve(user);
        } catch (error) {
            return Promise.reject(new ErrorHelper().createNewError(ErrorType.COOKIE_LOGIN_ERROR));
        }
    };
}
