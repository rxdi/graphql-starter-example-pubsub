# Example for @gapi infrastructure using rabbitmq and graphql

#### Installing packages

```bash
npm install
```

#### Starting RabbitMQ using docker-compose

```bash
docker-compose up
```

#### Starting the server

```bash
npm start
```

#### Open Graphiql Playground in browser

```
http://localhost:9000/graphiql
```

#### Testing subscriptions

There is a mutation called `sendMessage`

```graphql
mutation {
  sendMessage(message: "my-message") {
    message
  }
}
```

The actual code which does the message sending in queue looks like this

```typescript
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
```

#### Subscribing to message queue from Graphiql Playground

```graphql
subscription {
  listenForChanges {
    message
  }
}
```

The actual code for creating this subscription looks like this

```typescript
@Type(AppType)
@Subscribe(function(this: AppQueriesController) {
  return this.pubsub.asyncIterator('MY_CHANNEL');
})
@Subscription()
listenForChanges(message: IAppType) {
  return message;
}
```

So actually we are publishing messages to the queue they are send to RabbitMQ and every listener aka subscriber is using `listenForChanges` subscription query to get the actual changes send by `sendMessage` mutation.

#### Opening the RabbitMQ Dashboard

http://142.10.0.5:15672

We should see prompt for login so we can use our default credentials defined inside `docker-compose`

username: `my-user`
password: `my-user-password`

Notice that until you have a subscriber to a particular topic the connection with RabbitMQ is lazy and will not be established.

As long as `listenForChanges` is subscribed using the Graphql Playground we should imidiately see that Exchanges, Queues and Connections are defined.

Njoy!
