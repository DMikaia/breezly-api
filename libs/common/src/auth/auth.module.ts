import { Module } from '@nestjs/common';
import { AuthGuard } from './guard/auth.guard';

@Module({
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
