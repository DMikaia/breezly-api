import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from '@libs/common';
import { Comment } from '@libs/comment-contracts';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@libs/common/schema/comments';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async findOne(comment_id: number) {
    return this.database.query.comments.findFirst({
      where: eq(schema.comments.id, comment_id),
    });
  }

  async findAll(blog_id: number, limit: number, offset: number) {
    return this.database.query.comments.findMany({
      where: eq(schema.comments.blog_id, blog_id),
      limit,
      offset,
    });
  }

  async create(user_id: string, comment: Comment) {
    await this.database.insert(schema.comments).values({ user_id, ...comment });
  }

  async update(id: number, user_id: string, comment: Comment) {
    await this.database
      .update(schema.comments)
      .set({ user_id, ...comment })
      .where(
        and(eq(schema.comments.id, id), eq(schema.comments.user_id, user_id)),
      );
  }

  async delete(id: number, user_id: string) {
    await this.database
      .delete(schema.comments)
      .where(
        and(eq(schema.comments.id, id), eq(schema.comments.user_id, user_id)),
      );
  }
}
