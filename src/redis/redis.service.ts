import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import type { Redis as RedisClient } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: RedisClient;

  onModuleInit() {
    this.client = new Redis(); // 기본 localhost:6379 연결
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds); // TTL 설정
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string) {
    return await this.client.get(key);
  }

  async del(key: string) {
    return await this.client.del(key);
  }
}
