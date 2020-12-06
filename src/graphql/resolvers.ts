import { IResolvers } from 'apollo-server-express';

import { TicketService } from '../services';

import { Database, TicketEntity } from '../lib/types';

const ticketService = new TicketService();

export const resolvers: IResolvers = {
    Query: {
        getTickets: async (_root: undefined, _args: undefined, { db }: { db: Database }): Promise<TicketEntity[]> => {
            return await ticketService.queryGetAllTickets({ db });
        },
    },
};
