import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '@libs/common';
import * as schema from '@libs/common/schema/users';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { User } from '@libs/user-contracts';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async getUsers() {
    return this.database.query.users.findMany({});
  }

  async createUser(user: User) {
    await this.database.insert(schema.users).values(user);
  }

  async updateUser(user: User) {
    await this.database
      .update(schema.users)
      .set(user)
      .where(eq(schema.users.clerk_id, user.clerk_id));
  }
}
