import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';

export const GetAppleUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    console.log(request.headers);
    console.log('request.headers.....');

    if (!request.headers.authorization) {
      throw new UnauthorizedException('You must be logged in');
    }

    return request.headers.authorization;
  },
);
