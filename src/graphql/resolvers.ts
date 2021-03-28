import { IResolvers } from 'apollo-server-express';
import { Request, Response } from 'express';

import { AuthenticationService, UserService } from '../services';

import { Database, Viewer, LoginArgs, UserQueryArgs, UserEntity } from '../lib/types';

const authenticationService = new AuthenticationService();
const userService = new UserService();

export const resolvers: IResolvers = {
    Query: {
        authUrl: (): Promise<string> => authenticationService.queryGetGoogleAuthUrl(),
        user: async (
            _root: undefined,
            { id }: UserQueryArgs,
            { db, req }: { db: Database; req: Request },
        ): Promise<UserEntity> => {
            return await userService.queryUser({ id, db, req });
        },
    },
    Mutation: {
        logIn: async (
            _root: undefined,
            { input }: LoginArgs,
            { db, req, res }: { db: Database; req: Request; res: Response },
        ): Promise<Viewer> => {
            return await authenticationService.mutationLoginWithAuthCode({ input, db, req, res });
        },
        logOut: (_root: undefined, _args: undefined, { res }: { res: Response }): Viewer =>
            authenticationService.mutationLogOut({ res }),
    },
    // field resolvers
    Viewer: {
        id: (viewer: Viewer): string | undefined => viewer._id,
        hasWallet: (viewer: Viewer): boolean | undefined => {
            return viewer.walletId ? true : undefined;
        },
    },
};
