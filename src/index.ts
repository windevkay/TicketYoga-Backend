// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';

import { connectDatabase } from './database';
import { resolvers, typeDefs } from './graphql';

const port = process.env.PORT;

const mount = async (app: Application) => {
    const db = await connectDatabase();
    //apply other middlewares
    app.use(cookieParser(process.env.COOKIE_SECRET));

    const server = new ApolloServer({ resolvers, typeDefs, context: ({ req, res }) => ({ db, req, res }) });

    server.applyMiddleware({ app, path: '/api' });

    app.get('/', (req, res) => res.send('TicketYoga: checkout /api for playground'));

    app.listen(port, () => console.log(`Backend services running on PORT: ${port}`));
};

mount(express());
