import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Socket } from 'socket.io';
import { BattleService } from './battle.service';

/**
* init(handleConnection): addToWaitingQueue->startGame,getRandomQuestions->sendQuestion
* event(handleAnswer): ->sendQuestion or finishGame
*/
@WebSocketGateway({ namespace: '/battle' })
export class BattleGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly battleService: BattleService) { }

  handleConnection(socket: Socket) {
    this.battleService.addToWaitingQueue(socket);
  }

  handleDisconnect(socket: Socket) {
    this.battleService.removeFromGame(socket);
  }

  @SubscribeMessage('submitAnswer')
  handleAnswer(
    @MessageBody() answer: string,
    @ConnectedSocket() socket: Socket,
  ) {
    this.battleService.handleAnswer(socket, answer);
  }
}