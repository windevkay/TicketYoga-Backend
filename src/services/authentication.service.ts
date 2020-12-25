import crypto from 'crypto';

import { LoginResponse, Viewer, Database, UserEntity } from '../lib/types';

import { ErrorHelper, ErrorType } from './helpers/Error.helper';
import { Google } from './requests';

export class AuthenticationService {
    /**
     * Returns the login URL required for Google OAUTH
     */
    public queryGetGoogleAuthUrl = (): Promise<string> => {
        return Promise.resolve(Google.authUrl());
    };

    public mutationLoginWithAuthCode = async (params: {
        input: { code: string } | null;
        db: Database;
    }): Promise<Viewer> => {
        const { input, db } = params;
        const authCode = input ? input.code : null;
        // generate user session token
        const token = crypto.randomBytes(16).toString('hex');

        const user: UserEntity | undefined = authCode
            ? await this.middlewareLoginViaGoogle({ authCode, token, db })
            : undefined;

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

    private middlewareLoginViaGoogle = async (params: {
        authCode: string;
        token: string;
        db: Database;
    }): Promise<UserEntity | undefined> => {
        const { authCode, token, db } = params;
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
    };
}
