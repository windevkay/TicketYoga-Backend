import { Collection, ObjectId, MongoClient } from 'mongodb';
import { people_v1 } from 'googleapis';

export interface LoginArgs {
    input: { code: string } | null;
}

export interface LoginResponse {
    user: people_v1.Schema$Person;
    googleAccessToken?: string;
    googleRefreshToken?: string;
}

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

export interface Viewer {
    _id?: string;
    token?: string;
    avatar?: string;
    walletId?: string;
    didRequest: boolean;
}

export interface UserEntity {
    _id: string;
    token: string;
    name: string;
    avatar: string;
    contact: string;
    walletId?: string;
    income: number;
    events: ObjectId[];
    tickets: ObjectId[];
    googleAccessToken?: string;
    googleRefreshToken?: string;
}

export interface TicketEntity {
    _id: ObjectId;
    event: ObjectId;
    owner: string;
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
    details: string;
    images: string[];
    date: string;
    maxAudience: number;
    eventAdmin: string;
    tickets: ObjectId[];
    price: number;
    address: string;
    country: string;
    admin: string;
    city: string;
}
