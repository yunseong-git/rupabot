import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CS_QUESTIONS } from './data/questions';

type GameSession = {
    players: [Socket, Socket];
    scores: Map<string, number>;
    currentQuestionIndex: number;
    questions: typeof CS_QUESTIONS;
};

@Injectable()
export class BattleService {
    private waitingQueue: Socket[] = [];
    private activeGames = new Map<string, GameSession>();

    addToWaitingQueue(socket: Socket) {
        this.waitingQueue.push(socket);
        if (this.waitingQueue.length >= 2) {
            const player1 = this.waitingQueue.shift();
            const player2 = this.waitingQueue.shift();
            if (player1 && player2) {
                this.startGame(player1, player2);
            }
        }
    }

    removeFromGame(socket: Socket) {
        // TODO: 게임 중 이탈 처리
    }

    startGame(player1: Socket, player2: Socket) {
        const sessionId = `${player1.id}_${player2.id}`;
        const questions = this.getRandomQuestions(5);
        const scores = new Map([[player1.id, 0], [player2.id, 0]]);

        this.activeGames.set(sessionId, {
            players: [player1, player2],
            scores,
            currentQuestionIndex: 0,
            questions,
        });

        player1.emit('startGame', { opponent: player2.id });
        player2.emit('startGame', { opponent: player1.id });

        this.sendQuestion(sessionId);
    }

    handleAnswer(socket: Socket, answer: string) {
        const sessionId = [...this.activeGames.keys()].find((id) =>
            id.includes(socket.id),
        );

        if (!sessionId) {
            socket.emit('error', {
                code: 'NO_SESSION',
                message: '게임 세션을 찾을 수 없습니다.',
            });
            return;
        }

        const game = this.activeGames.get(sessionId);

        if (!game) {
            socket.emit('error', {
                code: 'NO_GAME_FOUND',
                message: '진행 중인 게임을 찾을 수 없습니다.',
            });
            return;
        }

        const currentQ = game.questions[game.currentQuestionIndex];

        if (answer.trim().toLowerCase() === currentQ.answer.trim().toLowerCase()) {
            const currentScore = game.scores.get(socket.id) || 0;
            game.scores.set(socket.id, currentScore + 1);
            socket.emit('correct', { answer });

            if (currentScore + 1 >= 5) {
                this.finishGame(sessionId, socket);
            } else {
                game.currentQuestionIndex++;
                this.sendQuestion(sessionId);
            }
        } else {
            socket.emit('wrong');
        }

    }

    sendQuestion(sessionId: string) {
        const game = this.activeGames.get(sessionId);

        if (game) {
            const question = game.questions[game.currentQuestionIndex];

            game.players.forEach((player) => {
                player.emit('question', {
                    subject: question.subject,
                    question: question.question,
                    index: game.currentQuestionIndex + 1,
                });
            });
        }
    }

    finishGame(sessionId: string, winner: Socket) {
        const game = this.activeGames.get(sessionId);
        winner.emit('win');
        if (game) {
            game.players
                .filter((p) => p.id !== winner.id)
                .forEach((p) => p.emit('lose'));
        }

        // TODO: 루파 지급, wallet 기록
        this.activeGames.delete(sessionId);
    }

    getRandomQuestions(count = 5) {
        return [...CS_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, count);
    }
}