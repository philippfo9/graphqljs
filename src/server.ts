import express from 'express';
import graphqlHTTP from 'express-graphql';
import { graphql, buildSchema } from 'graphql';

const schema = buildSchema(`
    type Query {
        hello: String
        miroslav: Miroslav
    }
    type Miroslav {
        a: String
        b(id: String): String
    }
`);

const root = {
    hello: () => {
        return 'Heyo world'
    },
    miroslav: {
        a: () => {
            return 'Obviously';
        },
        b: (args: {id: string}) => {
            console.log(args);
            return 'Let me check your: ' + args.id;
        }
    }
};

const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');


/* Running a graphql query against the schema and the root directly */ 
graphql(schema, '{ hello }', root).then(response => {
    console.log(response);
})

