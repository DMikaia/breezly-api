import { Module } from '@nestjs/common';
import { ClerkHttpGuard } from './guard';
import { ValidationStrategy } from './strategy/validation.strategy';
import { SignatureResolver } from './strategy/signature.resolver';

@Module({
  providers: [
    SignatureResolver,
    {
      provide: 'ValidationStrategy',
      useFactory: (clerkSignature: string) =>
        new ValidationStrategy(clerkSignature),
      inject: ['CLERK_SIGNATURE'],
    },
    ClerkHttpGuard,
  ],
  exports: [ClerkHttpGuard, 'ValidationStrategy'],
})
export class ClerkEventModule {}
