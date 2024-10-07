import { Test, TestingModule } from '@nestjs/testing';
import { BlogsService } from './blogs.service';
import { DATABASE_CONNECTION } from '@libs/common';
import { blog, blog_dto } from '@libs/blog-contracts';
import * as schema from '@libs/common/schema/blogs';
import { eq } from 'drizzle-orm';

const mockDatabase = {
  query: {
    blogs: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  },
  insert: jest.fn().mockReturnValue({
    values: jest.fn().mockResolvedValue(undefined),
  }),
  update: jest.fn().mockReturnValue({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockResolvedValue(undefined),
    }),
  }),
  delete: jest.fn().mockReturnValue({
    where: jest.fn().mockResolvedValue(undefined),
  }),
};

describe('BlogsService', () => {
  let blogsService: BlogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogsService,
        {
          provide: DATABASE_CONNECTION,
          useValue: mockDatabase,
        },
      ],
    }).compile();

    blogsService = module.get<BlogsService>(BlogsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(blogsService).toBeDefined();
  });

  describe('Create', () => {
    it('Should create a new blog', async () => {
      const author_id = 'clerk_123';

      await blogsService.create(author_id, blog_dto);

      expect(mockDatabase.insert).toHaveBeenCalledWith(schema.blogs);
      expect(mockDatabase.insert().values).toHaveBeenCalledWith({
        author_id,
        ...blog_dto,
      });
    });
  });

  describe('Find all', () => {
    it('It should return an array of blog', async () => {
      const mockBlogs = [blog];

      mockDatabase.query.blogs.findMany.mockResolvedValue(mockBlogs);

      const result = await blogsService.findAll();

      expect(result).toEqual(mockBlogs);
      expect(mockDatabase.query.blogs.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('Find one', () => {
    it('It should return a blog if it exists', async () => {
      mockDatabase.query.blogs.findFirst.mockResolvedValue(blog);

      const result = await blogsService.findOne(1);

      expect(result).toEqual(blog);
      expect(mockDatabase.query.blogs.findFirst).toHaveBeenCalledWith({
        where: eq(schema.blogs.id, 1),
        with: {
          comments: true,
        },
      });
    });

    it('Should throw a not found exception when the blog is not found', async () => {
      mockDatabase.query.blogs.findFirst.mockResolvedValue(undefined);

      await expect(blogsService.findOne(1)).rejects.toThrow('Blog not found');

      expect(mockDatabase.query.blogs.findFirst).toHaveBeenCalledWith({
        where: eq(schema.blogs.id, 1),
        with: {
          comments: true,
        },
      });
    });
  });

  describe('Update', () => {
    it('Should update a blog when the blog exist and it is the author', async () => {
      const mockUpdate = { id: 1, ...blog_dto };
      mockDatabase.query.blogs.findFirst.mockResolvedValue(blog);
      jest.spyOn(blogsService, 'isAuthor').mockResolvedValue(true);

      await blogsService.update('clerk_123', mockUpdate);

      expect(mockDatabase.query.blogs.findFirst).toHaveBeenCalledWith({
        where: eq(schema.blogs.id, 1),
      });
      expect(blogsService.isAuthor).toHaveBeenCalledWith(
        blog.author_id,
        'clerk_123',
      );
      expect(mockDatabase.update).toHaveBeenCalledWith(schema.blogs);
      expect(mockDatabase.update().set).toHaveBeenCalledWith(mockUpdate);
      expect(mockDatabase.update().set().where).toHaveBeenCalledWith(
        eq(schema.blogs.id, mockUpdate.id),
      );
    });

    it('Should throw a not found exception when the blog does not exist', async () => {
      mockDatabase.query.blogs.findFirst.mockResolvedValue(undefined);

      await expect(
        blogsService.update('clerk_123', { id: 1, ...blog_dto }),
      ).rejects.toThrow('Blog not found');
      expect(mockDatabase.query.blogs.findFirst).toHaveBeenCalledWith({
        where: eq(schema.blogs.id, 1),
      });
    });

    it('Should throw an unauthorized exception when the blog exist but it is not the author', async () => {
      const mockUpdate = { id: 1, ...blog_dto };
      mockDatabase.query.blogs.findFirst.mockResolvedValue(blog);
      jest.spyOn(blogsService, 'isAuthor').mockResolvedValue(false);

      await expect(
        blogsService.update('clerk_124', mockUpdate),
      ).rejects.toThrow('Action denied');
      expect(mockDatabase.query.blogs.findFirst).toHaveBeenCalledWith({
        where: eq(schema.blogs.id, 1),
      });
      expect(blogsService.isAuthor).toHaveBeenCalledWith(
        blog.author_id,
        'clerk_124',
      );
    });
  });

  describe('Delete', () => {
    it('Should delete a blog when the blog exist and it is the author', async () => {
      mockDatabase.query.blogs.findFirst.mockResolvedValue(blog);
      jest.spyOn(blogsService, 'isAuthor').mockResolvedValue(true);

      await blogsService.delete('clerk_123', 1);

      expect(mockDatabase.query.blogs.findFirst).toHaveBeenCalledWith({
        where: eq(schema.blogs.id, 1),
      });
      expect(blogsService.isAuthor).toHaveBeenCalledWith(
        blog.author_id,
        'clerk_123',
      );
      expect(mockDatabase.delete).toHaveBeenCalledWith(schema.blogs);
      expect(mockDatabase.delete().where).toHaveBeenCalledWith(
        eq(schema.blogs.id, 1),
      );
    });

    it('Should throw a not found exception when the blog does not exist', async () => {
      mockDatabase.query.blogs.findFirst.mockResolvedValue(undefined);

      await expect(blogsService.delete('clerk_123', 1)).rejects.toThrow(
        'Blog not found',
      );

      expect(mockDatabase.query.blogs.findFirst).toHaveBeenCalledWith({
        where: eq(schema.blogs.id, 1),
      });
    });

    it('Should throw an unauthorized exception when the blog exist but it is not the author', async () => {
      mockDatabase.query.blogs.findFirst.mockResolvedValue(blog);
      jest.spyOn(blogsService, 'isAuthor').mockResolvedValue(false);

      await expect(blogsService.delete('clerk_124', 1)).rejects.toThrow(
        'Action denied',
      );

      expect(mockDatabase.query.blogs.findFirst).toHaveBeenCalledWith({
        where: eq(schema.blogs.id, 1),
      });
      expect(blogsService.isAuthor).toHaveBeenCalledWith(
        blog.author_id,
        'clerk_124',
      );
    });
  });
});
