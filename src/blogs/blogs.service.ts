import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '@libs/common';
import { Blog } from '@libs/blog-contracts';
import * as schema from '@libs/common/schema/blogs/';
import { eq } from 'drizzle-orm';

@Injectable()
export class BlogsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async create(blog: Blog) {
    await this.database.insert(schema.blogs).values(blog);
  }

  async findAll() {
    return this.database.query.blogs.findMany({
      with: {
        comments: true,
      },
    });
  }

  async findOne(blog_id: number) {
    return this.database.query.blogs.findFirst({
      where: eq(schema.blogs.id, blog_id),
      with: {
        comments: true,
      },
    });
  }

  async update(id: number, blog: Blog) {
    await this.database
      .update(schema.blogs)
      .set(blog)
      .where(eq(schema.blogs.id, id));
  }

  async remove(id: number) {
    await this.database.delete(schema.blogs).where(eq(schema.blogs.id, id));
  }
}
