//  this interceptor will be used by the custom param decorator to fetch the current User
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';

import { UserService } from '../../modules/user/user.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UserService) {
    this.userService = userService;
  }

  // handler refers to the route handler
  public async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const { sub: userId, tokenData } = request.user || {};
      if (!user || user.role === 'admin' || user.sub === 'admin') {
        return handler.handle();
    }
    if (tokenData) {
      request.currentUser = JSON.parse(tokenData);
    } else if (userId) {
      const user = await this.userService.findUserById(userId);

      
      request.currentUser = user;
    }
    

    return handler.handle();
  }
}
