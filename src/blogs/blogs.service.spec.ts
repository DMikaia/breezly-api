import { Test, TestingModule } from '@nestjs/testing';
import { BlogsService } from './blogs.service';
import { DATABASE_CONNECTION } from '@libs/common';
import { blog, blog_dto } from '@libs/blog-contracts';
import * as schema from '@libs/common/schema/blogs';
import { and, eq } from 'drizzle-orm';

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

  describe('Find one', () => {
    describe('When find one is call', () => {
      let result: typeof blog;

      beforeEach(async () => {
        mockDatabase.query.blogs.findFirst.mockResolvedValue(blog);
        result = await blogsService.findOne(1);
      });

      test('then it should call the database find first to get the blog', async () => {
        expect(mockDatabase.query.blogs.findFirst).toHaveBeenCalledWith({
          where: eq(schema.blogs.id, 1),
          with: {
            comments: true,
          },
        });
      });

      test('then it should return the blog', async () => {
        expect(result).toEqual(blog);
      });
    });

    describe('When it fails, it will throw an exception', () => {
      beforeEach(async () => {
        mockDatabase.query.blogs.findFirst.mockResolvedValue(undefined);
        await expect(blogsService.findOne(1)).rejects.toThrow('Blog not found');
      });

      test('should call the database find first to get the blog', async () => {
        expect(mockDatabase.query.blogs.findFirst).toHaveBeenCalledWith({
          where: eq(schema.blogs.id, 1),
          with: {
            comments: true,
          },
        });
      });
    });
  });

  describe('Find all', () => {
    describe('When find all is called', () => {
      let result: (typeof blog)[];

      beforeEach(async () => {
        mockDatabase.query.blogs.findMany.mockResolvedValue([blog]);
        result = await blogsService.findAll();
      });

      test('then it should call the database find many to get the blog', async () => {
        expect(mockDatabase.query.blogs.findMany).toHaveBeenCalledTimes(1);
      });

      test('then it should return the blog list', async () => {
        expect(result).toEqual([blog]);
      });
    });
  });

  describe('Create', () => {
    describe('When create is called', () => {
      const author_id = 'clerk_123';

      beforeEach(async () => {
        await blogsService.create(author_id, blog_dto);
      });

      test('then it should call the database create to add a new blog', async () => {
        expect(mockDatabase.insert).toHaveBeenCalledWith(schema.blogs);
        expect(mockDatabase.insert().values).toHaveBeenCalledWith({
          author_id,
          ...blog_dto,
        });
      });
    });
  });

  describe('Update', () => {
    describe('When update is called', () => {
      const mockUpdate = { id: 1, ...blog_dto };

      beforeEach(async () => {
        await blogsService.update('clerk_123', mockUpdate);
      });

      test('should call database to update the blog', async () => {
        expect(mockDatabase.update).toHaveBeenCalledWith(schema.blogs);
        expect(mockDatabase.update().set).toHaveBeenCalledWith(mockUpdate);
        expect(mockDatabase.update().set().where).toHaveBeenCalledWith(
          and(
            eq(schema.blogs.id, mockUpdate.id),
            eq(schema.blogs.author_id, 'clerk_123'),
          ),
        );
      });
    });
  });

  describe('Delete', () => {
    describe('When delete is called', () => {
      beforeEach(async () => {
        await blogsService.delete('clerk_123', 1);
      });

      test('should call database to delete the blog', async () => {
        expect(mockDatabase.delete).toHaveBeenCalledWith(schema.blogs);
        expect(mockDatabase.delete().where).toHaveBeenCalledWith(
          and(eq(schema.blogs.id, 1), eq(schema.blogs.author_id, 'clerk_123')),
        );
      });
    });
  });
});
