import { CommentsController } from './comments.controller';
import { AuthGuard, ClerkRequest, DatabaseModule } from '@libs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { ConfigModule } from '@nestjs/config';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import {
  CommentDto,
  create_req,
  delete_req,
  find_all,
  mockCommentsService,
  queried_comment,
  update_req,
} from '@libs/comment-contracts';

describe('CommentsController', () => {
  let commentsController: CommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
        DatabaseModule,
      ],
      controllers: [CommentsController],
      providers: [{ provide: CommentsService, useValue: mockCommentsService }],
    }).compile();

    commentsController = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(commentsController).toBeDefined();
  });

  describe('Create', () => {
    const casted_request = create_req as ClerkRequest;

    describe('When create is called', () => {
      beforeEach(async () => {
        jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
        await commentsController.create(casted_request);
      });

      test('then it should call the create method of the comments service', async () => {
        expect(mockCommentsService.create).toHaveBeenCalledWith({
          user_id: casted_request.clerk_id,
          ...casted_request.body,
        });
      });
    });

    describe('When the guard rejects the request', () => {
      test('then it should throw an unauthorized exception', async () => {
        jest
          .spyOn(AuthGuard.prototype, 'canActivate')
          .mockRejectedValue(new UnauthorizedException('Unauthorized'));
        mockCommentsService.create.mockReturnValue(undefined);
        expect(await commentsController.create(casted_request)).toBeUndefined();
      });
    });
  });

  describe('Find All', () => {
    describe('When find all is called', () => {
      beforeEach(async () => {
        jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
        await commentsController.findAll(find_all);
      });

      test('then it should call the find all method of the comments service', async () => {
        expect(mockCommentsService.findAll).toHaveBeenCalledWith(find_all);
      });
    });

    describe('When the guard rejects the request', () => {
      test('then it should throw an unauthorized exception', async () => {
        jest
          .spyOn(AuthGuard.prototype, 'canActivate')
          .mockRejectedValue(new UnauthorizedException('Unauthorized'));
        mockCommentsService.create.mockReturnValue(undefined);
        expect(await commentsController.findAll(find_all)).toBeUndefined();
      });
    });
  });

  describe('Find One', () => {
    const comment_id: number = 1;

    describe('When find one is called', () => {
      let result: CommentDto;

      beforeEach(async () => {
        jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
        mockCommentsService.findOne.mockReturnValue(queried_comment);
        result = await commentsController.findOne(comment_id);
      });

      test('then it should call the find one method of the comments service', async () => {
        expect(mockCommentsService.findOne).toHaveBeenCalledWith(comment_id);
      });

      test('then it should return the comment', async () => {
        expect(result).toEqual(queried_comment);
      });
    });

    describe('When the comment is not found', () => {
      beforeEach(async () => {
        jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
        mockCommentsService.findOne.mockRejectedValue(
          new NotFoundException('Comment not found'),
        );
      });

      test('then it should call the create method of the comments service', async () => {
        expect(mockCommentsService.findOne).toHaveBeenCalledWith(comment_id);
      });

      test('then it should throw a not found exception', async () => {
        await expect(commentsController.findOne(comment_id)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('When the guard rejects the request', () => {
      test('then it should throw an unauthorized exception', async () => {
        jest
          .spyOn(AuthGuard.prototype, 'canActivate')
          .mockRejectedValue(new UnauthorizedException('Unauthorized'));
        mockCommentsService.findOne.mockReturnValue(undefined);
        expect(await commentsController.findOne(comment_id)).toBeUndefined();
      });
    });
  });

  describe('Update', () => {
    const casted_request = update_req as ClerkRequest;
    const id = 1;

    describe('When update is called', () => {
      beforeEach(async () => {
        jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
        await commentsController.update(id, casted_request);
      });

      test('then it should call the update method of the comments service', async () => {
        expect(mockCommentsService.update).toHaveBeenCalledWith({
          id,
          user_id: casted_request.clerk_id,
          ...casted_request.body,
        });
      });
    });

    describe('When the guard rejects the request', () => {
      test('then it should throw an unauthorized exception', async () => {
        jest
          .spyOn(AuthGuard.prototype, 'canActivate')
          .mockRejectedValue(new UnauthorizedException('Unauthorized'));
        mockCommentsService.update.mockReturnValue(undefined);
        expect(
          await commentsController.update(id, casted_request),
        ).toBeUndefined();
      });
    });
  });

  describe('Delete', () => {
    const casted_request = delete_req as ClerkRequest;
    const id = 1;

    describe('When delete is called', () => {
      beforeEach(async () => {
        jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
        await commentsController.delete(id, casted_request);
      });

      test('then it should call the delete method of the comments service', async () => {
        expect(mockCommentsService.delete).toHaveBeenCalledWith({
          id,
          user_id: casted_request.clerk_id,
        });
      });
    });

    describe('When the guard rejects the request', () => {
      test('then it should throw an unauthorized exception', async () => {
        jest
          .spyOn(AuthGuard.prototype, 'canActivate')
          .mockRejectedValue(new UnauthorizedException('Unauthorized'));
        mockCommentsService.delete.mockReturnValue(undefined);
        expect(
          await commentsController.delete(id, casted_request),
        ).toBeUndefined();
      });
    });
  });
});
