import { v4 as uuidv4 } from 'uuid';

export interface IWorkPlace {
    id: string;
    companyName: string;
    country?: string;
}

export type BaseWorkplace = Omit<IWorkPlace, "id">

export const workplaces: IWorkPlace[] = [{
    id: uuidv4(),
    companyName: 'Hey Ltd',
    country: 'GB'
}, {
    id: uuidv4(),
    companyName: 'Bye GmbH',
    country: 'AT'
}, {
    id: uuidv4(),
    companyName: 'Johe GmbH',
    country: 'DE'
}];

export function newWorkplace(baseWorkplace: BaseWorkplace) {
    return {
        ...baseWorkplace,
        id: uuidv4()
    };
}