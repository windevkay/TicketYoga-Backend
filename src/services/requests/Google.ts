import { google } from 'googleapis';

import { LoginResponse } from '../../lib/types';

import { ErrorType, ErrorHelper } from '../helpers/Error.helper';

const auth = new google.auth.OAuth2(
    process.env.G_CLIENT_ID,
    process.env.G_CLIENT_SECRET,
    `${process.env.PUBLIC_URL}/login`,
);

export const Google = {
    /**
     * Retrieves the url needed for user login
     */
    authUrl: (): string => {
        try {
            return auth.generateAuthUrl({
                access_type: 'online',
                scope: [
                    'https://www.googleapis.com/auth/userinfo.email',
                    'https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/calendar',
                ],
            });
        } catch (error) {
            return new ErrorHelper().createNewError(ErrorType.GOOGLE_AUTH_URL_ERROR);
        }
    },
    /**
     * Fetches an auth token from Google for use in querying the people API
     * @param code The auth code returned from Google after user signin
     */
    logIn: async (code: string): Promise<LoginResponse> => {
        try {
            const { tokens } = await auth.getToken(code);
            //access_token refresh_token
            const googleAccessToken = tokens.access_token ? tokens.access_token : undefined;
            const googleRefreshToken = tokens.refresh_token ? tokens.refresh_token : undefined;

            auth.setCredentials(tokens);

            const { data } = await google.people({ version: 'v1', auth }).people.get({
                resourceName: 'people/me',
                personFields: 'emailAddresses,names,photos',
            });

            return Promise.resolve({ user: data, googleAccessToken, googleRefreshToken });
        } catch (error) {
            return Promise.reject(new ErrorHelper().createNewError(ErrorType.GOOGLE_LOGIN_ERROR));
        }
    },
};
