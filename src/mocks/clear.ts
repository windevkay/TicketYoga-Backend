// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { connectDatabase } from '../database';

const clear = async () => {
    try {
        console.log('[clear] : running...');
        const db = await connectDatabase();

        const bookings = await db.tickets.find({}).toArray();
        const listings = await db.events.find({}).toArray();
        const users = await db.users.find({}).toArray();

        if (bookings.length > 0) {
            await db.tickets.drop();
        }
        if (listings.length > 0) {
            await db.events.drop();
        }
        if (users.length > 0) {
            await db.users.drop();
        }

        console.log('[clear] : success');
    } catch {
        throw new Error('failed to clear database');
    }
};

clear();
