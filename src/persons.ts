import { v4 as uuidv4 } from 'uuid';

/* Note to self:
 * - this is suboptimal, bc I need to type the same thing again as in the graphql schema and it can easily diverge 
 */

export interface IPerson {
    id: string;
    name: string;
}

export interface IStudent extends IPerson {
    school: string;
}

interface IWorker extends IPerson {
    workplace?: IWorkPlace;
}

export interface IWorkPlace {
    companyName: string;
    country?: string;
}

export type WorkerOrStudent = IWorker | IStudent;

export function isStudent(person: WorkerOrStudent): person is IStudent {
    return !!(person as IStudent).school;
}

export const workplaces: IWorkPlace[] = [{
    companyName: 'Hey Ltd',
    country: 'GB'
}, {
    companyName: 'Bye GmbH',
    country: 'AT'
}, {
    companyName: 'Johe GmbH',
    country: 'DE'
}];

export const persons: WorkerOrStudent[] = [];

const names = ['Jeff', 'Bill', 'Gustav', 'Franco', 'Christina', 'Kristine', 'Bella', 'Joseph', 'Maria'];

for (let i = 0; i < 9; i++) {
    if (i % 2 == 0) {
        persons.push({
            id: uuidv4(),
            name: names[i],
            school: 'First Boring School or so'
        }); 
    } else {
        persons.push({
            id: uuidv4(),
            name: names[i],
            workplace: workplaces[Math.round(Math.random() * 2)]
        });
    }
}

console.log({persons});
