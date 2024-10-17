import { Module } from '@nestjs/common';
import { AuthModule, DatabaseModule } from '@libs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { CommentsModule } from './comments/comments.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        CLERK_PUBLISHABLE_KEY: Joi.string().required(),
        CLERK_SECRET_KEY: Joi.string().required(),
        CLERK_SIGNATURE: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        GATEWAY_PORT: Joi.number().port().required(),
        NODE_ENV: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    BlogsModule,
    CommentsModule,
  ],
})
export class AppModule {}
