import { IResolvers } from 'apollo-server-express';
import { Request, Response } from 'express';

import { AuthenticationService } from '../services';

import { Database, Viewer, LoginArgs } from '../lib/types';

const authenticationService = new AuthenticationService();

export const resolvers: IResolvers = {
    Query: {
        authUrl: (): Promise<string> => authenticationService.queryGetGoogleAuthUrl(),
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
