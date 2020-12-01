// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import { resolvers, typeDefs } from './graphql';

const port = process.env.PORT;

const app = express();
const server = new ApolloServer({ resolvers, typeDefs });

server.applyMiddleware({ app, path: '/api' });

app.get('/', (req, res) => res.send('TicketYoga'));

app.listen(port, () => console.log(`Backend server running on PORT: ${port}`));
