import express from 'express';
import graphqlHTTP from 'express-graphql';
import { graphql, buildSchema } from 'graphql';
import { persons, IStudent, BaseStudent, isStudent, WorkerOrStudent, newStudent, newWorker } from '../entities/persons';
import { workplaces, newWorkplace, BaseWorkplace } from '../entities/workplaces';

/* Note to self 
 * - this is schema is already way to large, to be easily viewable
 */


const schema = buildSchema(`
    type Mutation {
        addStudent(name: String!, school: String!): Student!
        addWorker(name: String!, workplaceID: ID!): Worker!
        addWorkplace(companyName: String!, country: String): WorkPlace!
    }

    type Query {
        hello: String
        miroslav: Miroslav
        person(id: ID!): Person
        studentsFromSchool(school: String!): [Student!]!
        searchPersons(searchTerm: String!): [SearchPersonResult]!
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

    union SearchPersonResult = Student | Worker

    type WorkPlace {
        id: ID!
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
    searchPersons: ({searchTerm}: {searchTerm: string}): WorkerOrStudent[] => {
        return persons.filter(person => person.name.includes(searchTerm));
    },
    addStudent: (baseStudent: BaseStudent): IStudent => {
        const addedStudent = newStudent(baseStudent);
        persons.push(
            addedStudent
        );
        return addedStudent;
    },
    addWorker: ({name, workplaceID}: {name: string, workplaceID: string}) => {
        const addedWorker = newWorker(name, workplaceID);
        persons.push(
            addedWorker
        );
        return addedWorker;
    },
    addWorkplace: (baseWorkplace: BaseWorkplace) => {
        const addedWorkplace = newWorkplace(baseWorkplace);
        workplaces.push(
            addedWorkplace
        );
        return addedWorkplace;
    },
    workplaces: workplaces,
    SearchPersonResult: {
        resolveType: (obj: any, context: any, info: any) => {
            if (obj.school) return 'Student';
            else if (obj.workplace) return 'Worker';
            else return null;
        }
    },
    Student: {
        isTypeOf: (obj: any) => !!obj.school
    },
    Worker: {
        isTypeOf: (obj: any) => !!obj.workplace
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

