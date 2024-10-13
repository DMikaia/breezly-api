import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DATABASE_CONNECTION } from '@libs/common';
import { Comment, CommentDto, UpdateComment } from '@libs/comment-contracts';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '@libs/common/schema/comments';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async findOne(comment_id: number): Promise<CommentDto> {
    const comment = await this.database.query.comments.findFirst({
      where: eq(schema.comments.id, comment_id),
      with: {},
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async findAll(data: {
    blog_id: number;
    limit: number;
    offset: number;
  }): Promise<CommentDto[]> {
    return this.database.query.comments.findMany({
      where: eq(schema.comments.blog_id, data.blog_id),
      limit: data.limit,
      offset: data.offset,
      with: {},
    });
  }

  async create(comment: Comment): Promise<void> {
    await this.database.insert(schema.comments).values(comment);
  }

  async update(comment: UpdateComment): Promise<void> {
    await this.database
      .update(schema.comments)
      .set(comment)
      .where(
        and(
          eq(schema.comments.id, comment.id),
          eq(schema.comments.user_id, comment.user_id),
        ),
      );
  }

  async delete(data: { id: number; user_id: string }): Promise<void> {
    await this.database
      .delete(schema.comments)
      .where(
        and(
          eq(schema.comments.id, data.id),
          eq(schema.comments.user_id, data.user_id),
        ),
      );
  }
}
