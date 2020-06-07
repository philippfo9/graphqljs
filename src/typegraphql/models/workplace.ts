import { v4 as uuidv4 } from 'uuid';
import { ObjectType, Field, ID, ArgsType } from 'type-graphql';

@ObjectType()
export class Workplace {
    @Field(type => ID)
    id: string;

    @Field()
    companyName: string;

    @Field({nullable: true})
    country?: string;
}

export type BaseWorkplace = Omit<Workplace, "id">;

@ArgsType()
export class IWorkplaceInput implements Partial<Workplace> {
    @Field()
    companyName: string;

    @Field({nullable: true})
    country?: string;
}

export function newWorkplace(baseWorkplace: BaseWorkplace): Workplace {
    const workplace = new Workplace();
    workplace.id = uuidv4();
    workplace.companyName = baseWorkplace.companyName;
    workplace.country = baseWorkplace.country;
    return workplace;
}

export const workplaces: Workplace[] = [
    newWorkplace({
        companyName: 'Hey Ltd',
        country: 'GB'
    }), 
    newWorkplace({
        companyName: 'Bye GmbH',
        country: 'AT'
    }),
    newWorkplace({
        companyName: 'Johe GmbH',
        country: 'DE'
    })
];

