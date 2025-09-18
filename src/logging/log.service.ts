import { Inject, Injectable, LoggerService, Scope } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston'
import { logDto } from './log.dto';

@Injectable({ scope: Scope.TRANSIENT })
export class LogService implements LoggerService {
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,) { }

    log(message: string, context?: string) {
        this.logger.info(message, { context });
    }

    warn(message: string, context?: string) {
        this.logger.warn(message, { context });
    }

    error(message: string, trace?: string, context?: string) {
        this.logger.error(message, { context, trace });
    }

    debug(message: string, context?: string) {
        this.logger.debug(message, { context });
    }
    logByDto(dto: logDto.Based) {
        const context = `${dto.type.toUpperCase()} ${dto.apiName}`;
        const message = `[userId=${dto.userId}] [ip=${dto.ip}] [ua=${dto.userAgent}]`;

        switch (dto.level) {
            case 'error':
                this.logger.error(message, { context });
                break;
            case 'warn':
                this.logger.warn(message, { context });
                break;
            case 'info':
                this.logger.info(message, { context });
                break;
            case 'verbose':
                this.logger.verbose(message, { context });
                break;
            case 'debug':
                this.logger.debug(message, { context });
                break;
            default:
                this.logger.info(message, { context });
        }
    }
}