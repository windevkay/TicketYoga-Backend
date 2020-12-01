import { IResolvers } from 'apollo-server-express';

export const resolvers: IResolvers = {
    Query: {
        getTickets: (): string => {
            return 'this are all the tickets';
        },
    },
};
