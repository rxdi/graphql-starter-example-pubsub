import { Injectable } from '@rxdi/core';

interface WebSocketConnectionParams {
  Authorization: string;
}

@Injectable()
export class AuthService {
  async onSubConnection(connectionParams: WebSocketConnectionParams, websocket) {
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

  async authenticate() {
    return {
      user: {
        id: 1,
      },
    };
  }
}
