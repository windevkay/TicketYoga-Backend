import { Request } from 'express';
import { Database, UserEntity } from '../types';

import { ErrorHelper, ErrorType } from '../../services/helpers/Error.helper';

export const authorizeAction = async (db: Database, req: Request): Promise<UserEntity | null> => {
    try {
        const token = req.get('X-CSRF-TOKEN');
        const appViewer = await db.users.findOne({
            _id: req.signedCookies.viewer,
            token,
        });
        return Promise.resolve(appViewer);
    } catch (error) {
        return new ErrorHelper().createNewError(ErrorType.AUTHORIZATION_ERROR);
    }
};
