import { Injectable, Inject } from '@nestjs/common';
import { createHmac } from 'crypto';
import { Payload } from '../../dto';

@Injectable()
export class ValidationStrategy {
  constructor(
    @Inject('CLERK_SIGNATURE') private readonly clerk_signature: string,
  ) {}

  public validate(payload: Payload): boolean {
    const signedContent = `${payload.headers.svix_id}.${payload.headers.svix_timestamp}.${JSON.stringify(payload.body)}`;

    const secretBytes = Buffer.from(
      this.clerk_signature.split('_')[1],
      'base64',
    );

    const secret = createHmac('sha256', secretBytes)
      .update(signedContent)
      .digest('base64');

    return secret ? true : false;
  }
}
