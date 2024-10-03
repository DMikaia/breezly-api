import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DATABASE_CONNECTION } from '../constants';
import { ConfigService } from '@nestjs/config';
import * as user_schema from '../schema/users';
import * as blog_schema from '../schema/blogs';
import * as comment_schema from '../schema/comments';
import * as notification_schema from '../schema/notifications';

@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const connectionString = configService.get<string>('DATABASE_URL');
        const pool = new Pool({
          connectionString,
          ssl: false,
        });

        return drizzle(pool, {
          schema: {
            ...user_schema,
            ...blog_schema,
            ...comment_schema,
            ...notification_schema,
          },
        });
      },
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
