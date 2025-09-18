import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';
import { LogService } from './log.service';
import { logDto } from './log.dto';

@Injectable()
export class LogInterceptor implements NestInterceptor {
    constructor(private readonly logService: LogService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest<Request>();
        const user = req.user as any; // 타입 보강

        const dto: logDto.Based = {
            level: 'info',
            type: req.method,
            apiName: req.originalUrl,
            userId: user?.userId || 'anonymous',
            ip: req.ip || '',
            userAgent: req.headers['user-agent'] || '',
        };

        return next.handle().pipe(
            tap(() => this.logService.logByDto(dto)),
        );
    }
}