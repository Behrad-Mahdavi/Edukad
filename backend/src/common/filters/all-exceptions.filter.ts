import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message: any = 'Internal server error';
    if (exceptionResponse) {
      message =
        typeof exceptionResponse === 'object'
          ? (exceptionResponse as any).message || exceptionResponse
          : exceptionResponse;
    } else if ((exception as any)?.message) {
      message = (exception as any).message;
    }

    console.error('🔥 UNCAUGHT SERVER EXCEPTION:', exception);

    response.status(status).json({
      statusCode: status,
      message,
      error: (exception as any)?.name || 'InternalServerError',
      details: (exception as any)?.meta || (exception as any)?.message || String(exception),
    });
  }
}
