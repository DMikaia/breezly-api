import * as schema from '@libs/common/schema/comments';
import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { DATABASE_CONNECTION } from '@libs/common';
import {
  comment,
  CommentDto,
  delete_comment,
  find_all,
  find_one,
  queried_comment,
} from '@libs/comment-contracts';
import { and, eq } from 'drizzle-orm';

const mockDatabase = {
  query: {
    comments: {
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

describe('CommentsService', () => {
  let commentsService: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: DATABASE_CONNECTION,
          useValue: mockDatabase,
        },
      ],
    }).compile();

    commentsService = module.get<CommentsService>(CommentsService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(commentsService).toBeDefined();
  });

  describe('Find One', () => {
    describe('when find one is called', () => {
      let result: CommentDto;

      beforeEach(async () => {
        mockDatabase.query.comments.findFirst.mockResolvedValue(
          queried_comment,
        );
        result = await commentsService.findOne(find_one.id);
      });

      test('then it should call the database to find the comment', async () => {
        expect(mockDatabase.query.comments.findFirst).toHaveBeenCalledWith({
          where: eq(schema.comments.id, find_one.id),
          with: {},
        });
      });

      test('then it should return the actual comment on success', async () => {
        expect(result).toEqual(queried_comment);
      });
    });

    describe('when it is not found', () => {
      beforeEach(async () => {
        mockDatabase.query.comments.findFirst.mockResolvedValue(undefined);
        await expect(commentsService.findOne(find_one.id)).rejects.toThrow(
          'Comment not found',
        );
      });

      test('then it should call the database to find the comment', async () => {
        expect(mockDatabase.query.comments.findFirst).toHaveBeenCalledWith({
          where: eq(schema.comments.id, find_one.id),
          with: {},
        });
      });
    });
  });

  describe('Find All', () => {
    describe('when find all is called', () => {
      const { id, limit, offset } = find_all;
      let result: CommentDto[];

      beforeEach(async () => {
        mockDatabase.query.comments.findMany.mockResolvedValue([
          queried_comment,
        ]);
        result = await commentsService.findAll(id, limit, offset);
      });

      test('then it should call the database to get all the comment of one blog', async () => {
        expect(mockDatabase.query.comments.findMany).toHaveBeenCalledWith({
          where: eq(schema.comments.blog_id, id),
          limit,
          offset,
          with: {},
        });
      });

      test('then it should return the limited list of the comment in the blog', async () => {
        expect(result).toEqual([queried_comment]);
      });
    });
  });

  describe('Create', () => {
    describe('when create is called', () => {
      beforeEach(async () => {
        await commentsService.create(comment);
      });

      test('then it should call the database to create a new comment', async () => {
        expect(mockDatabase.insert).toHaveBeenCalledWith(schema.comments);
        expect(mockDatabase.insert().values).toHaveBeenCalledWith(comment);
      });
    });
  });

  describe('Update', () => {
    describe('when update is called', () => {
      beforeEach(async () => {
        await commentsService.update(comment);
      });

      test('then it should call the database to update the comment', async () => {
        expect(mockDatabase.update).toHaveBeenCalledWith(schema.comments);
        expect(mockDatabase.update().set).toHaveBeenCalledWith(comment);
        expect(mockDatabase.update().set().where).toHaveBeenCalledWith(
          and(
            eq(schema.comments.id, comment.blog_id),
            eq(schema.comments.user_id, comment.user_id),
          ),
        );
      });
    });
  });

  describe('Delete', () => {
    describe('when delete is called', () => {
      beforeEach(async () => {
        await commentsService.delete(delete_comment.id, delete_comment.user_id);
      });

      test('then it should call the database to delete the comment', async () => {
        expect(mockDatabase.delete).toHaveBeenCalledWith(schema.comments);
        expect(mockDatabase.delete().where).toHaveBeenCalledWith(
          and(
            eq(schema.comments.id, delete_comment.id),
            eq(schema.comments.user_id, delete_comment.user_id),
          ),
        );
      });
    });
  });
});
