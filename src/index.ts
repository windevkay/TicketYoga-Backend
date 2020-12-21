// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';

import { connectDatabase } from './database';
import { resolvers, typeDefs } from './graphql';

const port = process.env.PORT;

const mount = async (app: Application) => {
    const db = await connectDatabase();
    const server = new ApolloServer({ resolvers, typeDefs, context: () => ({ db }) });

    server.applyMiddleware({ app, path: '/api' });

    app.get('/', (req, res) => res.send('TicketYoga: checkout /api for playground'));

    app.listen(port, () => console.log(`Backend services running on PORT: ${port}`));
};

mount(express());
