import { Collection, ObjectId, MongoClient } from 'mongodb';

export enum TicketCategory {
    REGULAR = 'REGULAR',
    VIP = 'VIP',
}

export enum TradeStatus {
    ORIGINAL = 'ORIGINAL',
    RESALE = 'RESALE',
}

export interface Database {
    users: Collection<UserEntity>;
    tickets: Collection<TicketEntity>;
    events: Collection<EventEntity>;
    client: MongoClient;
}

export interface UserEntity {
    _id: string;
    firstname: string;
    lastname: string;
    events: ObjectId[];
}

export interface TicketEntity {
    _id: ObjectId;
    event: ObjectId;
    owner: ObjectId;
    price: number;
    ticketCategory: TicketCategory;
    transferable: boolean;
    expiryDate: string;
    validity: boolean;
    tradeStatus: TradeStatus;
}

export interface EventEntity {
    _id: ObjectId;
    name: string;
    location: string;
    date: string;
    maxAudience: number;
    eventAdmin: ObjectId;
    tickets: ObjectId[] | null;
}
