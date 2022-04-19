import {
  Controller,
  GraphQLNonNull,
  GraphQLString,
  Mutation,
  PubSubService,
  Subscribe,
  Subscription,
  Type,
  withFilter,
} from '@gapi/core';

import { IAppType } from '~core/api-introspection';

import { GraphqlContext } from './app.context';
import { AppType } from './app.type';

@Controller()
export class AppQueriesController {
  constructor(private pubsub: PubSubService) {}

  @Type(AppType)
  @Mutation({
    message: {
      type: new GraphQLNonNull(GraphQLString),
    },
  })
  sendMessage(root, { message }, context: GraphqlContext): IAppType {
    this.pubsub.publish('MY_CHANNEL', { message });

    return { message };
  }

  @Type(AppType)
  @Subscribe(function(this: AppQueriesController) {
    return this.pubsub.asyncIterator('MY_CHANNEL');
  })
  @Subscription()
  listenForChanges(payload: IAppType, args, context: GraphqlContext) {
    console.log(payload, args, context);
    return payload;
  }

  @Type(AppType)
  @Subscribe(
    withFilter(
      (self: AppQueriesController) => self.pubsub.asyncIterator('MY_CHANNEL'),
      (payload, args, context: GraphqlContext) => {
        console.log(payload, args, context);
        return true;
      },
    ),
  )
  @Subscription()
  listenForChangesWithFilter(payload: IAppType, args, context: GraphqlContext) {
    console.log(payload, args, context);
    return payload;
  }
}
