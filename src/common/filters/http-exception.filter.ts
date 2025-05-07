import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  import { CommonErrorResponseDto } from '../dto/common-error-response.dto';
  
  @Catch()
  export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
  
      const message =
        exception instanceof HttpException
          ? exception.getResponse()['message'] || exception.message
          : 'Internal server error';
  
      const error =
        exception instanceof HttpException
          ? exception.name
          : 'InternalServerError';
  
      const errorResponse = new CommonErrorResponseDto({
        statusCode: status,
        message,
        error,
      });
  
      response.status(status).json(errorResponse);
    }
  }