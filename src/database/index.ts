import { MongoClient } from 'mongodb';

import { Database, UserEntity, EventEntity, TicketEntity } from '../lib/types';

const user = process.env.DB_USER;
const userPassword = process.env.DB_USER_PASSWORD;
const cluster = process.env.DB_CLUSTER;

const connectionUrl = `mongodb+srv://${user}:${userPassword}@${cluster}.mongodb.net/<dbname>?retryWrites=true&w=majority`;

export const connectDatabase = async (): Promise<Database> => {
    try {
        const client = await MongoClient.connect(connectionUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const db = client.db('primary');

        console.log('Data connection established!');

        return {
            events: db.collection<EventEntity>('events'),
            tickets: db.collection<TicketEntity>('tickets'),
            users: db.collection<UserEntity>('users'),
            client,
        };
    } catch (error) {
        return Promise.reject(`Error establishing mongodb connection: ${error}`);
    }
};
