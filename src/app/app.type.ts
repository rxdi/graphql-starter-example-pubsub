import { GraphQLObjectType, GraphQLString } from '@gapi/core';

export const AppType = new GraphQLObjectType({
  name: 'AppType',
  fields: () => ({
    message: {
      type: GraphQLString,
    },
  }),
});
