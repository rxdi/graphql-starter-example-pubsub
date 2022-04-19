import {
  CoreModule,
  GenericGapiResolversType,
  GRAPHQL_PLUGIN_CONFIG,
  HookService,
  Module,
  ON_REQUEST_HANDLER,
  RESOLVER_HOOK,
} from '@gapi/core';

import { AuthService } from '~app/auth.service';
import { Environment, isProduction } from '~app/environment';

@Module({
  imports: [
    CoreModule.forRoot({
      server: {
        hapi: {
          port: Environment.API_PORT || process.env.PORT || 9000,
          routes: {
            cors: {
              origin: ['*'],
              additionalHeaders: [
                'Host',
                'User-Agent',
                'Accept',
                'Accept-Language',
                'Accept-Encoding',
                'Access-Control-Request-Method',
                'Access-Control-Allow-Origin',
                'Access-Control-Request-Headers',
                'Origin',
                'Connection',
                'Pragma',
                'Cache-Control',
              ],
            },
          },
        },
      },
      graphql: {
        path: '/graphql',
        graphiQlPath: '/graphiql',
        openBrowser: false,
        watcherPort: 8967,
        writeEffects: false,
        graphiql: false,
        graphiQlPlayground: true,
        graphiqlOptions: {
          endpointURL: '/graphql',
          passHeader: `'Authorization':'${Environment.GRAPHIQL_TOKEN}'`,
          subscriptionsEndpoint: `ws://localhost:${Environment.API_PORT || process.env.PORT || 9000}/subscriptions`,
          websocketConnectionParams: {
            token: Environment.GRAPHIQL_TOKEN,
          },
        },
        graphqlOptions: {
          schema: null,
        },
      },
      pubsub: {
        activateRabbitMQ: isProduction() || Environment.RABBITMQ_ENABLED,
        host: Environment.AMQP_HOST,
        port: Environment.AMQP_PORT,
        pass: Environment.AMQP_PASS,
        user: Environment.AMQP_USER,
        authentication: AuthService as never,
        subscriptionServerOptions: {
          perMessageDeflate: {
            zlibDeflateOptions: {
              // See zlib defaults.
              chunkSize: 1024,
              memLevel: 7,
              level: 3,
            },
            zlibInflateOptions: {
              chunkSize: 10 * 1024,
            },
            // Other options settable:
            clientNoContextTakeover: true, // Defaults to negotiated value.
            serverNoContextTakeover: true, // Defaults to negotiated value.
            serverMaxWindowBits: 10, // Defaults to negotiated value.
            // Below options specified as default values.
            concurrencyLimit: 10, // Limits zlib concurrency for perf.
            threshold: 1024, // Size (in bytes) below which messages
            // should not be compressed.
          },
        },
      },
    }),
  ],
  providers: [
    {
      provide: RESOLVER_HOOK,
      deps: [HookService],
      useFactory: () => (resolver: GenericGapiResolversType) => {
        const resolve = resolver.resolve.bind(resolver.target) as typeof resolver.resolve;
        resolver.resolve = async function(root, args, context, info) {
          /*
           *  Here every resolver can be modified even we can check for the result and strip some field
           *  Advanced logic for authentication can be applied here using @gapi/ac or equivalent package
           */
          const result = await resolve(root, args, context, info);

          return result;
        };
        return resolver;
      },
    },
    {
      provide: ON_REQUEST_HANDLER,
      deps: [GRAPHQL_PLUGIN_CONFIG, AuthService],
      useFactory: (config: GRAPHQL_PLUGIN_CONFIG, authService: AuthService) => async (
        next: Function,
        request: Request,
      ) => {
        /* Every request comming from client will be processed here so we can put user context or other context here */
        request;
        // request.headers.authorization
        config.graphqlOptions.context = await authService.authenticate();
        return next();
      },
    },
  ],
})
export class FrameworkImports {}
