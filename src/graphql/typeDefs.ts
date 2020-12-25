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
        token: String!
        name: String!
        avatar: String!
        contact: String!
        events: [Event!]
        tickets: [Ticket!]
    }
    type Event {
        id: ID!
        name: String!
        details: String!
        images: [String!]
        date: String!
        maxAudience: Int!
        eventAdmin: User!
        tickets: [Ticket!]
        price: Float!
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
    type Viewer {
        id: ID
        token: String
        avatar: String
        hasWallet: Boolean
        didRequest: Boolean!
    }
    input LogInInput {
        code: String!
    }
    type Query {
        authUrl: String!
    }
    type Mutation {
        logIn(input: LogInInput): Viewer!
        logOut: Viewer!
    }
`;
