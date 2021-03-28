import { log } from '../decorators';

export enum ErrorType {
    //ERRORS RELATED TO GOOGLE OAUTH
    GOOGLE_LOGIN_ERROR = 'GOOGLE_LOGIN_ERROR',
    GOOGLE_AUTH_URL_ERROR = 'GOOGLE_AUTH_URL_ERROR',
    GOOGLE_USER_ERROR = 'GOOGLE_USER_ERROR',
    //ERRORS RELATED TO LOGGING OUT OR COOKIES
    ERROR_LOGGING_OUT = 'ERROR_LOGGING_OUT',
    COOKIE_LOGIN_ERROR = 'COOKIE_LOGIN_ERROR',
    //AUTHORIZATION ERRORS
    AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
    //USER ERRORS
    ERROR_FINDING_USER = 'ERROR_FINDING_USER',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
}

const ErrorMessages = {
    GOOGLE_LOGIN_ERROR: 'There was an error logging in with Google',
    GOOGLE_AUTH_URL_ERROR: 'There was an error getting the Auth Url from Google',
    GOOGLE_USER_ERROR: 'There was an error getting User Data from Google',
    ERROR_LOGGING_OUT: 'There was an error Logging Out of the App',
    COOKIE_LOGIN_ERROR: 'There was an error getting User via Cookie',
    AUTHORIZATION_ERROR: 'There was an error Authorizing User action',
    ERROR_FINDING_USER: 'There was an error retrieving this user',
    USER_NOT_FOUND: 'User not found',
};

export class ErrorHelper {
    @log
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public createNewError(action: ErrorType): any {
        throw new Error(ErrorMessages[action]);
    }
}
