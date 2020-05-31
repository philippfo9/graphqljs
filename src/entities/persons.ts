import { v4 as uuidv4 } from 'uuid';
import { IWorkPlace, workplaces } from './workplaces';

/* Note to self:
 * - this is suboptimal, bc I need to type the same thing again as in the graphql schema and it can easily diverge 
 */

const names = ['Jeff', 'Bill', 'Gustav', 'Franco', 'Christina', 'Kristine', 'Bella', 'Joseph', 'Maria'];
const citizenships = ['AT', 'DE', 'US', 'IT'];

export interface IPersonInput {
    name: string;
    citizenship: string;
}

export interface IPerson {
    id: string;
    name: string;
    citizenship: string;
}

export interface IStudent extends IPerson {
    school: string;
}

export type BaseStudent = Omit<IStudent, "id">;

export function newStudent(baseStudent: BaseStudent): IStudent {
    return {
        ...baseStudent,
        id: uuidv4(),
    };
}

interface IWorker extends IPerson {
    workplace?: IWorkPlace;
}

export function newWorker({name, citizenship}: IPersonInput, workplaceID: string): IWorker {
    const workplace = workplaces.find(workplace => workplace.id === workplaceID);
    return {
        name,
        workplace,
        citizenship,
        id: uuidv4()
    }
}

export type WorkerOrStudent = IWorker | IStudent;

export function isStudent(person: WorkerOrStudent): person is IStudent {
    return !!(person as IStudent).school;
}

export const persons: WorkerOrStudent[] = [];

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
