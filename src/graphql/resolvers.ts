import { IResolvers } from 'apollo-server-express';

import { AuthenticationService } from '../services';

import { Database, Viewer, LoginArgs } from '../lib/types';

const authenticationService = new AuthenticationService();

export const resolvers: IResolvers = {
    Query: {
        authUrl: () => authenticationService.queryGetGoogleAuthUrl(),
    },
    Mutation: {
        logIn: async (_root: undefined, { input }: LoginArgs, { db }: { db: Database }): Promise<Viewer> => {
            return await authenticationService.mutationLoginWithAuthCode({ input, db });
        },
        logOut: (): Viewer => authenticationService.mutationLogOut(),
    },
    // field resolvers
    Viewer: {
        id: (viewer: Viewer): string | undefined => viewer._id,
        hasWallet: (viewer: Viewer): boolean | undefined => {
            return viewer.walletId ? true : undefined;
        },
    },
};
