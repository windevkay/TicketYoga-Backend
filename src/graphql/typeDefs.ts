import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    enum TicketCategory {
        REGULAR
        VIP
    }
    enum TradeStatus {
        ORIGINAL
        RESALE
    }
    type User {
        id: ID!
        firstname: String!
        lastname: String!
        events: [Event!]
    }
    type Event {
        id: ID!
        name: String!
        location: String!
        date: String!
        maxAudience: Int!
        eventAdmin: User!
        tickets: [Ticket!]
    }
    type Ticket {
        id: ID!
        event: Event!
        owner: User!
        price: Float!
        ticketCategory: TicketCategory!
        transferable: Boolean! #if the ticket can be resold or not
        expiryDate: String!
        validity: Boolean! #if ticket is valid for use or not
        tradeStatus: TradeStatus! #if ticket is an original or a resale
    }
    type Query {
        getTickets: [Ticket!]
    }
`;
