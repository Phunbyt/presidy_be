import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';

export const GetCurrentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (!request.currentUser) {
      throw new UnauthorizedException('You must be logged in');
    }

    return request.currentUser;
  },
);
