import { v4 as uuidv4 } from 'uuid';
import {InterfaceType, Field, ID, Int, ObjectType, createUnionType, InputType} from 'type-graphql';
import { Workplace, workplaces } from './workplace';


@InterfaceType({
    resolveType: value => {
        if (value.school) return 'Student';
        else if (value.workplace) return 'Worker';
        else return null;
    },
})
export abstract class IPerson {

    @Field(type => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    citizenship: string;
}

@InputType()
export class IPersonInputType implements Partial<IPerson> {
    @Field()
    name: string;

    @Field()
    citizenship: string;
}

@ObjectType({implements: IPerson})
export class Student extends IPerson {
    @Field({nullable: true})
    school?: string;
}

export type BaseStudent = Omit<Student, "id">;

export function newStudent(baseStudent: BaseStudent): Student {
    const student = new Student();
    student.id = uuidv4();
    student.name = baseStudent.name;
    student.citizenship = baseStudent.citizenship;
    student.school = baseStudent.school;
    return student;
}

@ObjectType({implements: IPerson})
export class Worker extends IPerson {
    @Field(type => Workplace, {nullable: true})
    workplace?: Workplace;
}

export function newWorker({name, citizenship}: IPersonInputType, workplaceID: string): Worker {
    const workplace = workplaces.find(workplace => workplace.id === workplaceID);
    const worker = new Worker();
    worker.id = uuidv4();
    worker.name = name;
    worker.citizenship = citizenship;
    worker.workplace = workplace;
    return worker;
}

export const SearchPersonResultType = createUnionType({
    name: 'WorkerOrStudent',
    types: () => [Student, Worker] as const,
    resolveType: value => {
        if ('school' in value) return 'Student';
        else if ('workplace' in value) return 'Worker';
        else return null;
    },
});

export function isStudent(person: typeof SearchPersonResultType): person is Student {
    return !!(person as Student).school;
}

const names = ['Jeff', 'Bill', 'Gustav', 'Franco', 'Christina', 'Kristine', 'Bella', 'Joseph', 'Maria'];
const citizenships = ['AT', 'DE', 'US', 'IT'];

export const persons: (typeof SearchPersonResultType)[] = [];

for (let i = 0; i < 9; i++) {
    const name = names[i];
    const citizenship = citizenships[i % 4];
    if (i % 2 == 0) {
        persons.push(
            newStudent({name, citizenship, school: 'First Boring School or so'})
        ); 
    } else {
        persons.push(
            newWorker({name, citizenship}, workplaces[Math.round(Math.random() * 2)].id)
        );
    }
}

console.log({persons});


