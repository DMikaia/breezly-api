import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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

  async createUser(user: User) {
    await this.database.insert(schema.users).values(user);
  }

  async findOne(user_id: number) {
    const user = await this.database.query.users.findFirst({
      where: eq(schema.users.id, user_id),
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findAll() {
    return await this.database.query.users.findMany({});
  }

  async updateUser(user: User) {
    await this.database
      .update(schema.users)
      .set(user)
      .where(eq(schema.users.clerk_id, user.clerk_id));
  }

  async deleteUser(clerk_id: string) {
    await this.database
      .delete(schema.users)
      .where(eq(schema.users.clerk_id, clerk_id));
  }
}
