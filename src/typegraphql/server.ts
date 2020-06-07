import 'reflect-metadata';
import graphqlHTTP from 'express-graphql';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { PersonResolver, StudentResolver, WorkerResolver, WorkplaceResolver } from './resolvers';

async function start() {
    const schema = await buildSchema({
        resolvers: [PersonResolver, StudentResolver, WorkerResolver, WorkplaceResolver]
    });

    const app = express();
    app.use('/graphql', graphqlHTTP({
        schema: schema,
        graphiql: true,
    }));
    app.listen(4000);
}

start();


