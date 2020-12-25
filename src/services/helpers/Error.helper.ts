import { log } from '../decorators';

export enum ErrorType {
    GOOGLE_LOGIN_ERROR = 'GOOGLE_LOGIN_ERROR',
    GOOGLE_AUTH_URL_ERROR = 'GOOGLE_AUTH_URL_ERROR',
    GOOGLE_USER_ERROR = 'GOOGLE_USER_ERROR',
}

const ErrorMessages = {
    GOOGLE_LOGIN_ERROR: 'There was an error logging in with Google',
    GOOGLE_AUTH_URL_ERROR: 'There was an error getting the Auth Url from Google',
    GOOGLE_USER_ERROR: 'There was an error getting User Data from Google',
};

export class ErrorHelper {
    @log
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public createNewError(action: ErrorType): any {
        throw new Error(ErrorMessages[action]);
    }
}
