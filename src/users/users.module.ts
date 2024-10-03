import { Module } from '@nestjs/common';
import { DatabaseModule } from '@libs/common';
import { ClerkEventModule } from '@libs/clerk-contracts';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ClerkService } from './clerk.service';

@Module({
  imports: [ClerkEventModule, DatabaseModule],
  controllers: [UsersController],
  providers: [ClerkService, UsersService],
})
export class UsersModule {}
