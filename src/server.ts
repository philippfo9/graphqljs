import { persons, IStudent, isStudent, WorkerOrStudent, workplaces } from './persons';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import { graphql, buildSchema } from 'graphql';

/* Note to self 
 * - this is schema is already way to large, to be easily viewable
 */


const schema = buildSchema(`
    type Query {
        hello: String
        miroslav: Miroslav
        person(id: ID!): Person
        studentsFromSchool(school: String!): [Student!]!
        searchPersons(searchString: String!): [PersonSearchResult]!
        workplaces: [WorkPlace!]!
    }

    type Miroslav {
        a: String
        b(id: String): String
    }

    interface Person {
        id: ID!
        name: String!
    }

    type Student implements Person {
        id: ID!
        name: String!
        school: String!
    }

    type Worker implements Person {
        id: ID!
        name: String!
        workplace: WorkPlace
    }

    union PersonSearchResult = Student | Worker

    type WorkPlace {
        companyName: String!
        country: String
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
    },
    person: (args: {id: string}) => {
        return persons.find(person => person.id === args.id);
    },
    studentsFromSchool: (args: {school: string}): IStudent[] => {
        return persons.filter(person => isStudent(person) && person.school === args.school) as IStudent[]; 
    },
    searchPersons: ({searchString}: {searchString: string}): WorkerOrStudent[] => {
        return persons.filter(person => person.name.includes(searchString));
    },
    workplaces: workplaces,
    PersonSearchResult: {
        resolveType(obj: any, context: any, info: any) {
            if (obj.school) return 'Student';
            else if (obj.workplace) return 'Worker';
            else return null
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

