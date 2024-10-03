import { Module } from '@nestjs/common';
import { AuthModule, DatabaseModule } from '@libs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        CLERK_SIGNATURE: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        GATEWAY_PORT: Joi.number().port().required(),
      }),
    }),
    AuthModule,
    DatabaseModule,
    UsersModule,
  ],
})
export class AppModule {}
