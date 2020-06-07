import { Resolver, Arg, Query, Mutation, Args } from 'type-graphql';
import { IPerson, SearchPersonResultType, persons, Student, isStudent, IPersonInputType, newStudent, Worker, newWorker } from './models/person';
import { Workplace, BaseWorkplace, workplaces, newWorkplace, IWorkplaceInput } from './models/workplace';

@Resolver()
export class PersonResolver {
    @Query(returns => IPerson, {nullable: true})
    async person(
        @Arg('id') id: string
    ): Promise<IPerson|undefined> {
        return persons.find(p => p.id === id);
    }

    @Query(returns => [SearchPersonResultType])
    async searchPersons(
        @Arg('searchTerm') searchTerm: string
    ): Promise<Array<typeof SearchPersonResultType>> {
        return persons.filter(person => person.name.includes(searchTerm));   
    }
}

@Resolver()
export class StudentResolver {
    @Query(returns => [Student])
    async studentsFromSchool(
        @Arg('school') school: string
    ): Promise<Array<Student>> {
        return persons.filter((person): person is Student => isStudent(person) && person.school === school); 
    }

    @Mutation(returns => Student)
    async addStudent(
        @Arg('input') input: IPersonInputType,
        @Arg('school') school: string
    ): Promise<Student> {
        return newStudent({
            ...input,
            school
        });
    }
}

@Resolver()
export class WorkerResolver {
    @Mutation(returns => Worker)
    async addWorker(
        @Arg('input') input: IPersonInputType,
        @Arg('workplaceID') workplaceID: string
    ): Promise<Worker> {
        return newWorker(input, workplaceID);
    }
}

@Resolver()
export class WorkplaceResolver {
    @Query(returns => Workplace)
    async workplaces(): Promise<Array<Workplace>> {
        return workplaces;
    }

    @Mutation(returns => Workplace)
    async addWorkplace(
        @Args() {companyName, country}: IWorkplaceInput 
    ): Promise<Workplace> {
        return newWorkplace({companyName, country});
    }
}