import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RANK_KEY } from '../decorators/rank.decorator';

@Injectable()
export class RankGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRank = this.reflector.getAllAndOverride<string>(RANK_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRank) {
      return true; // rank 제한이 없는 경우 통과
    }
    const { user } = context.switchToHttp().getRequest();
    return user?.rank === requiredRank;
  }
}