import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private logger: Logger;
  constructor() {
    this.logger = new Logger('APP');
  }

  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((err: HttpException) => {
        this.logger.debug(err.stack);
        this.logger.debug(err.message);

        return throwError(() => this.errorHandler(err, context));
      }),
    );
  }

  private errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorInfo: any = !exception?.getResponse
      ? exception
      : exception?.getResponse();

    return response.status(status).json({
      status: false,
      statusCode: status,
      error: true,
      path: request.url,
      message: Array.isArray(errorInfo.message)
        ? errorInfo.message[0]
        : errorInfo.message,
      data: errorInfo.error,
    });
  }

  private responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const statusCode = response.statusCode;

    return {
      status: true,
      path: request.url,
      statusCode,
      data: res.data ? res.data : res,
      pagination: res.pagination ?? false,
    };
  }
}
