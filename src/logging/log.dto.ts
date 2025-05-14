export namespace logDto {
    export class Based {
        level: 'error' | 'warn' | 'info' | 'verbose' | 'debug';
        type: string;
        apiName: string;
        userId: string;
        ip: string;
        userAgent: string;
    }
}