import { BaseWorkplace, newWorkplace } from './../entities/workplaces';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import { GraphQLInterfaceType, GraphQLID, GraphQLString, GraphQLObjectType, GraphQLUnionType, GraphQLList, GraphQLSchema, GraphQLInputObjectType, GraphQLNonNull } from 'graphql';
import { persons, IStudent, isStudent, WorkerOrStudent, newStudent, newWorker } from '../entities/persons';
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
        name: { type: GraphQLString },
        citizenship: { type: GraphQLString }
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
        citizenship: { type: GraphQLString }, 
        school: { type: GraphQLString }
    }
});

const WorkerType = new GraphQLObjectType({
    name: 'Worker',
    interfaces: [PersonType],
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        citizenship: { type: GraphQLString },
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

const QueryType = new GraphQLObjectType({
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

const PersonInputType = new GraphQLInputObjectType({
    name: 'PersonInput',
    fields: {
        name: { type: GraphQLString },
        citizenship: { type: GraphQLString }
    }
});

const MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addStudent: {
            type: StudentType,
            args: {
                school: { type: GraphQLString },
                input: { type: PersonInputType }
            },
            resolve: (_, {school, input}) => {
                const addedStudent = newStudent({school, ...input});
                persons.push(
                    addedStudent
                );
                return addedStudent;
            }
        },
        addWorker: {
            type: WorkerType,
            args: {
                workplaceID: { type: GraphQLString },
                input: { type: PersonInputType }
            },
            resolve: (_, {workplaceID, input}) => {
                const addedWorker = newWorker(input, workplaceID);
                persons.push(
                    addedWorker
                );
                return addedWorker;
            }
        },
        addWorkplace: {
            type: WorkplaceType,
            args: {
                companyName: {type: GraphQLString},
                country: {type: GraphQLString}
            },
            resolve: (_, {companyName, country}) => {
                const addedWorkplace = newWorkplace({companyName, country});
                workplaces.push(
                    addedWorkplace
                );
                return addedWorkplace;
            }
        }
    }
})

const graphQLSchema = new GraphQLSchema({ query: QueryType, mutation: MutationType });
const app = express();
app.use('/graphql', graphqlHTTP({
    schema: graphQLSchema,
    graphiql: true,
}));

app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');