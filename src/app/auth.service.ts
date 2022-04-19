import { Injectable } from '@rxdi/core';

import { GraphqlContext } from './app.context';

interface WebSocketConnectionParams {
  Authorization: string;
}

@Injectable()
export class AuthService {
  async onSubConnection(connectionParams: WebSocketConnectionParams, websocket): Promise<GraphqlContext> {
    console.log('Subscription connected');
    return this.authenticate();
  }
  async onSubDisconnect(websocket, context) {
    // Subscription disconnected
    console.log('Subscription disconnected');
  }

  onSubOperation(connectionParams, params, webSocket) {
    return params;
  }

  async authenticate(): Promise<GraphqlContext> {
    return {
      user: {
        id: '1',
      },
    };
  }
}
