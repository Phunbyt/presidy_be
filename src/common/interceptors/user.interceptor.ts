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

    const { sub: userId, tokenData } = request.user || {};

    if (tokenData) {
      request.currentUser = JSON.parse(tokenData);
    } else if (userId) {
      const user = await this.userService.findUserById(userId);
      // we need to pass this down to the decorator. SO we assign the user to request because req can be retrieved inside the decorator
      request.currentUser = user;
    }
    // run the actual route handler

    return handler.handle();
  }
}
