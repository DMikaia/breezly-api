import {
  ExecutionContext,
  CanActivate,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  private readonly requireAuth = ClerkExpressRequireAuth({});

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return new Promise((resolve, reject) => {
      this.requireAuth(request, response, (err: unknown) => {
        if (err) {
          this.logger.error(err);
          reject(new UnauthorizedException('Unauthorized'));
        } else {
          request.clerk_id = request.auth.userId;
          resolve(true);
        }
      });
    });
  }
}
