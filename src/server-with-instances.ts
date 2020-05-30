import { GraphQLInterfaceType, GraphQLID, GraphQLString } from 'graphql';

const personType = new GraphQLInterfaceType({
    name: 'Person',
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString }
    }
});