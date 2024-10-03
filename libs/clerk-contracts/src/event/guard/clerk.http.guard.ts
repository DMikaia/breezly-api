import {
  ExecutionContext,
  CanActivate,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { ValidationStrategy } from '../strategy/validation.strategy';

@Injectable()
export class ClerkHttpGuard implements CanActivate {
  constructor(
    @Inject('ValidationStrategy')
    private readonly validationStrategy: ValidationStrategy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<any>();

    const headers = {
      svix_id: request.headers['svix-id'] as string,
      svix_timestamp: request.headers['svix-timestamp'] as string,
      svix_signature: request.headers['svix-signature'] as string,
    };

    if (
      !headers.svix_id ||
      !headers.svix_timestamp ||
      !headers.svix_signature
    ) {
      throw new UnauthorizedException('Missing signature headers');
    }

    const isValid = this.validationStrategy.validate({
      headers,
      body: request.body,
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid signature');
    }

    return true;
  }
}
