// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { AuthenticationService } from './authentication.service';

import { Database } from '../lib/types';
import { connectDatabase } from '../database';

const authService = new AuthenticationService();

describe('AUTH QUERIES', () => {
    test('QueryGetGoogleAuthUrl returns a string', async () => {
        const authURL = await authService.queryGetGoogleAuthUrl();
        expect(typeof authURL).toBe('string');
        expect(authURL).not.toBeUndefined();
    });
});

describe('AUTH MUTATIONS', () => {
    let db: Database;
    beforeAll(async () => {
        db = await connectDatabase();
    });
    afterAll(async () => {
        await db.client.close();
    });
});
