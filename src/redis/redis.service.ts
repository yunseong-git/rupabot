import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly client: Redis) { }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) await this.client.set(key, value, 'EX', ttl); // TTL 설정
    else await this.client.set(key, value);
  }

  async get(key: string) {
    return await this.client.get(key);
  }

  async del(key: string) {
    return await this.client.del(key);
  }

  async pushToQueue(queue: string, value: string) {
    return this.client.rpush(queue, value);
  }

  async popFromQueue(queue: string) {
    return this.client.lpop(queue);
  }
}
