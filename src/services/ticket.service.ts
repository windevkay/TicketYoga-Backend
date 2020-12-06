import { Database, TicketEntity } from '../lib/types';

export class TicketService {
    /**
     * Returns all the Tickets available
     * @param params Object containing database
     */
    public queryGetAllTickets = async (params: { db: Database }): Promise<TicketEntity[]> => {
        const { db } = params;
        try {
            const tickets: TicketEntity[] = await db.tickets.find({}).toArray();
            return Promise.resolve(tickets);
        } catch (error) {
            return Promise.reject(error);
        }
    };
}
