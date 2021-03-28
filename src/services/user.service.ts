import { Request } from 'express';

import { Database, UserEntity } from '../lib/types';
import { authorizeAction } from '../lib/utils';

import { ErrorHelper, ErrorType } from './helpers/Error.helper';

export class UserService {
    /**
     * Queries and returns a user entity
     * @param params user id, database object
     */
    public queryUser = async (params: { id: string; db: Database; req: Request }): Promise<UserEntity> => {
        const { id, db, req } = params;
        try {
            const user = await db.users.findOne({ _id: id });
            if (!user) {
                return Promise.reject(new ErrorHelper().createNewError(ErrorType.USER_NOT_FOUND));
            }
            //check if client is authorized user
            const authResult = await authorizeAction(db, req);
            if (authResult && authResult._id === user._id) user.authorized = true;
            return Promise.resolve(user);
        } catch (error) {
            return Promise.reject(new ErrorHelper().createNewError(ErrorType.ERROR_FINDING_USER));
        }
    };
}
