import {objectType, interfaceType, unionType, queryType, idArg, stringArg, makeSchema} from '@nexus/schema';
import { persons } from '../entities/persons';

const WorkplaceType = objectType({
    name: 'Workplace',
    definition(t) {
        t.id('id');
        t.string('companyName');
        t.string('country')
    },
});

const PersonType = interfaceType({
    name: 'Person',
    definition(t) {
        t.id('id')
        t.string('name')
        t.string('citizenship')
        t.resolveType((person) => {
            if (person.school) return 'Student';
            else if (person.workplace) return 'Worker';
            else return null;
        })
    }  
});

const StudentType = objectType({
    name: 'Student',
    definition(t) {
        t.implements('Person');
        t.string('school')
    }
});

const WorkerType = objectType({
    name: 'Worker', 
    definition(t) {
        t.implements('Person')
        t.field('workplace', {
            type: 'WorkplaceType'
        })
    }
});

const SearchPersonResultType = unionType({
    name: 'WorkerOrStudent',
    definition(t) {
        t.members('Student', 'Worker')
    }
});

const QueryType = queryType({
    definition(t) {
        t.string('hello', () => 'hello world');
        t.field('person', {
            type: 'Person',
            args: {
                id: stringArg()
            },
            resolve: (_, {id}) => {
                return persons.find(p => p.id === id);
            }
        })
    }
});


const schema = makeSchema({
    types: [WorkplaceType, PersonType, StudentType, WorkerType, SearchPersonResultType, QueryType],
});