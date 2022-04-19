import {
  Controller,
  GraphQLNonNull,
  GraphQLString,
  Mutation,
  PubSubService,
  Subscribe,
  Subscription,
  Type,
} from '@gapi/core';

import { IAppType } from '~core/api-introspection';

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
  sendMessage(root, { message }): IAppType {
    this.pubsub.publish('MY_CHANNEL', { message });
    return { message };
  }

  @Type(AppType)
  @Subscribe(function(this: AppQueriesController) {
    return this.pubsub.asyncIterator('MY_CHANNEL');
  })
  @Subscription()
  listenForChanges(message: IAppType) {
    return message;
  }
}
