// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { ObjectId } from 'mongodb';

import { connectDatabase } from '../database';
import { EventEntity, UserEntity, TicketEntity, TicketCategory, TradeStatus } from '../lib/types';

const tickets: TicketEntity[] = [
    {
        _id: new ObjectId('5d378db94e84754160e08b42'),
        event: new ObjectId('5d378db94e84753160e08b31'),
        owner: '5d378db94e84753160e08b55',
        price: 25.0,
        ticketCategory: TicketCategory.REGULAR,
        transferable: true,
        expiryDate: '2020-12-30',
        validity: true,
        tradeStatus: TradeStatus.ORIGINAL,
    },
];

const events: EventEntity[] = [
    {
        _id: new ObjectId('5d378db94e84753160e08b31'),
        name: 'The Jones Event',
        details: 'details*****',
        images: ['image*****'],
        date: '2020-12-25',
        maxAudience: 20,
        eventAdmin: '5d378db94e84753160e08b55',
        tickets: [new ObjectId('5d378db94e84754160e08b42')],
        price: 20,
        address: 'address*****',
        country: 'country*****',
        admin: 'admin*****',
        city: 'city*****',
    },
];
const users: UserEntity[] = [
    {
        _id: '5d378db94e84753160e08b55',
        token: 'token*****',
        name: 'James Jones',
        avatar: 'avatar*****',
        contact: 'contact*****',
        walletId: 'wallet*****',
        income: 1000,
        events: [new ObjectId('5d378db94e84753160e08b31')],
        tickets: [new ObjectId('5d378db94e84754160e08b42')],
    },
];

const seed = async () => {
    try {
        console.log('[seed] : running...');
        const db = await connectDatabase();

        for (const event of events) {
            await db.events.insertOne(event);
        }

        for (const user of users) {
            await db.users.insertOne(user);
        }

        for (const ticket of tickets) {
            await db.tickets.insertOne(ticket);
        }

        console.log('[seed] : success');
    } catch (error) {
        throw new Error('failed to seed database');
    }
};

seed();
