import express from 'express';
import graphqlHTTP from 'express-graphql';
import { GraphQLInterfaceType, GraphQLID, GraphQLString, GraphQLObjectType, GraphQLUnionType, GraphQLList, GraphQLSchema } from 'graphql';
import { persons, IStudent, isStudent, WorkerOrStudent } from '../entities/persons';
import { workplaces } from '../entities/workplaces';

const WorkplaceType = new GraphQLObjectType({
    name: 'Workplace',
    fields: {
        companyName: { type: GraphQLString },
        country: { type: GraphQLString }
    }
})

const PersonType = new GraphQLInterfaceType({
    name: 'Person',
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString }
    },
    resolveType: (value: any) => {
        if (value.school) return 'Student';
        else if (value.workplace) return 'Worker';
        else return null;
    }
});

const StudentType = new GraphQLObjectType({
    name: 'Student',
    interfaces: [PersonType],
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        school: { type: GraphQLString }
    }
});

const WorkerType = new GraphQLObjectType({
    name: 'Worker',
    interfaces: [PersonType],
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        workplace: { type: WorkplaceType }
    }
});

const SearchPersonResultType = new GraphQLUnionType({
    name: 'WorkerOrStudent',
    types: [StudentType, WorkerType],
    resolveType: (value: any) => {
        if (value.school) return 'Student';
        else if (value.workplace) return 'Worker';
        else return null;
    }
})

const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        hello: {
            type: GraphQLString,
            resolve: () => 'Hello World',
        },
        person: {
            type: PersonType,
            args: {
                id: { type: GraphQLID }
            },
            resolve: (_, {id}): WorkerOrStudent | undefined => {
                return persons.find(person => person.id === id);
            }
        },
        studentsFromSchool: {
            type: new GraphQLList(StudentType),
            args: {
                school: { type: GraphQLString }
            },
            resolve: (_, {school}): IStudent[] => {
                return persons.filter(person => isStudent(person) && person.school === school) as IStudent[]; 
            }
        },
        // if you use the union type, there are no common fields as above in the interface type
        searchPersons: {
            type: new GraphQLList(SearchPersonResultType),
            args: {
                searchTerm: { type: GraphQLString }
            },
            resolve: (_, {searchTerm}): WorkerOrStudent[] => {
                return persons.filter(person => person.name.includes(searchTerm));
            }
        },
        workplaces: {
            type: WorkplaceType,
            resolve: (_) => workplaces
        } 
    }
});

const graphQLSchema = new GraphQLSchema({ query: queryType });
const app = express();
app.use('/graphql', graphqlHTTP({
    schema: graphQLSchema,
    graphiql: true,
}));

app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');