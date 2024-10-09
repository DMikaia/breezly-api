import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '@libs/common';
import { CreateBlog, UpdateBlog } from '@libs/blog-contracts';
import { and, eq } from 'drizzle-orm';
import * as schema from '@libs/common/schema/blogs';

@Injectable()
export class BlogsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async create(author_id: string, blog: CreateBlog) {
    await this.database.insert(schema.blogs).values({ author_id, ...blog });
  }

  async findAll() {
    return await this.database.query.blogs.findMany({
      with: {
        comments: true,
      },
    });
  }

  async findOne(blog_id: number) {
    const blog = await this.database.query.blogs.findFirst({
      where: eq(schema.blogs.id, blog_id),
      with: {
        comments: true,
      },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  async update(author_id: string, blog: UpdateBlog) {
    await this.database
      .update(schema.blogs)
      .set(blog)
      .where(
        and(
          eq(schema.blogs.id, blog.id),
          eq(schema.blogs.author_id, author_id),
        ),
      );
  }

  async delete(author_id: string, id: number) {
    await this.database
      .delete(schema.blogs)
      .where(
        and(eq(schema.blogs.id, id), eq(schema.blogs.author_id, author_id)),
      );
  }
}
