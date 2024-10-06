import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { AuthorUtils, DATABASE_CONNECTION } from '@libs/common';
import { CreateBlog, UpdateBlog } from '@libs/blog-contracts';
import { eq } from 'drizzle-orm';
import * as schema from '@libs/common/schema/blogs';

@Injectable()
export class BlogsService implements AuthorUtils {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async isAuthor(id: string, author_id: string) {
    return author_id == id;
  }

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
    return await this.database.query.blogs.findFirst({
      where: eq(schema.blogs.id, blog_id),
      with: {
        comments: true,
      },
    });
  }

  async update(id: number, author_id: string, blog: UpdateBlog) {
    const existing_blog = await this.findOne(id);

    if (!existing_blog) {
      throw new NotFoundException('Blog not found');
    }

    const is_author = await this.isAuthor(existing_blog.author_id, author_id);

    if (!is_author) {
      throw new UnauthorizedException('Action denied');
    }

    await this.database
      .update(schema.blogs)
      .set(blog)
      .where(eq(schema.blogs.id, id));
  }

  async remove(id: number, author_id: string) {
    const existing_blog = await this.findOne(id);

    if (!existing_blog) {
      throw new NotFoundException('Blog not found');
    }

    const is_author = await this.isAuthor(existing_blog.author_id, author_id);

    if (!is_author) {
      throw new UnauthorizedException('Action denied');
    }

    await this.database.delete(schema.blogs).where(eq(schema.blogs.id, id));
  }
}
