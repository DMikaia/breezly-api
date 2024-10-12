import { Test, TestingModule } from '@nestjs/testing';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard, blogs, ClerkRequest, DatabaseModule } from '@libs/common';
import { blog, blog_dto, mockBlogsService } from '@libs/blog-contracts';
import { NotFoundException } from '@nestjs/common';

describe('BlogsController', () => {
  let blogsController: BlogsController;
  let blogsService: BlogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
        DatabaseModule,
      ],
      controllers: [BlogsController],
      providers: [{ provide: BlogsService, useValue: mockBlogsService }],
    }).compile();

    blogsController = module.get<BlogsController>(BlogsController);
    blogsService = module.get<BlogsService>(BlogsService);
  });

  it('Should be defined', () => {
    expect(blogsController).toBeDefined();
  });

  describe('Find one', () => {
    describe('When find one is called', () => {
      let result: typeof blog;

      beforeEach(async () => {
        jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
        mockBlogsService.findOne.mockReturnValue(blog);

        result = await blogsController.findOne('1');
      });

      test('then it should call the find one service', async () => {
        expect(blogsService.findOne).toHaveBeenCalledWith(1);
      });

      test('then it should return the blog', async () => {
        expect(result).toEqual(blog);
      });
    });

    describe('When the blog is not found', () => {
      beforeEach(async () => {
        jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
        mockBlogsService.findOne.mockRejectedValue(
          new NotFoundException('Blog not found'),
        );
        await expect(blogsController.findOne('1')).rejects.toThrow(
          NotFoundException,
        );
      });

      test('then it should call the find one service', () => {
        expect(blogsService.findOne).toHaveBeenCalledWith(1);
      });
    });

    describe('When the guard reject the request', () => {
      let result: typeof blog;

      beforeEach(async () => {
        jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(false);
        mockBlogsService.findOne.mockReturnValue(undefined);
        result = await blogsController.findOne('1');
      });

      test('then is should return undefined', async () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('Find all', () => {
    describe('When find all is called', () => {
      let result: (typeof blog)[];

      beforeEach(async () => {
        jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
        mockBlogsService.findAll.mockReturnValue(blogs);

        result = await blogsController.findAll();
      });

      test('then it should call the find all service', async () => {
        expect(blogsService.findAll).toHaveBeenCalled();
      });

      test('then it should return the list of blogs', async () => {
        expect(result).toEqual(blogs);
      });
    });

    describe('When the guard rejects the request', () => {
      let result: (typeof blog)[];

      beforeEach(async () => {
        mockBlogsService.findAll.mockReturnValue(undefined);
        jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(false);
        result = await blogsController.findAll();
      });

      test('then is should return undefined', async () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('Create', () => {
    const req: unknown = {
      cookies: { session_id: 'session_123' },
      clerk_id: 'clerK_123',
      body: blog_dto,
      get: jest.fn(),
      header: jest.fn(),
    };

    const casted_request = req as ClerkRequest;

    describe('When create is called', () => {
      beforeEach(async () => {
        jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
        mockBlogsService.create.mockReturnValue(undefined);
        await blogsController.create(casted_request);
      });

      test('then it should call the create service', async () => {
        expect(blogsService.create).toHaveBeenCalledWith(
          casted_request.clerk_id,
          casted_request.body,
        );
      });
    });

    describe('When the guard rejects the request', () => {
      let result: undefined | void;

      beforeEach(async () => {
        jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(false);
        result = await blogsController.create(casted_request);
      });

      test('then is should return undefined', async () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('Update', () => {
    const req: unknown = {
      cookies: { session_id: 'session_123' },
      clerk_id: 'clerk_123',
      body: { id: 1, ...blog_dto },
      get: jest.fn(),
      header: jest.fn(),
    };

    const casted_request = req as ClerkRequest;

    describe('When update is called', () => {
      beforeEach(async () => {
        jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
        mockBlogsService.update.mockReturnValue(undefined);

        await blogsController.update('1', casted_request);
      });

      test('then it should call the update service', async () => {
        expect(blogsService.update).toHaveBeenCalledWith(
          'clerk_123',
          casted_request.body,
        );
      });
    });

    describe('When the guard rejects the request', () => {
      let result: void | undefined;

      beforeEach(async () => {
        jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(false);
        result = await blogsController.update('1', casted_request);
      });

      test('then is should return undefined', async () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('Delete', () => {
    const req: unknown = {
      cookies: { session_id: 'session_123' },
      clerk_id: 'clerk_123',
      body: null,
      get: jest.fn(),
      header: jest.fn(),
    };

    const casted_request = req as ClerkRequest;

    describe('When delete is called', () => {
      beforeEach(async () => {
        jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
        mockBlogsService.delete.mockReturnValue(undefined);

        await blogsController.delete('1', casted_request);
      });

      test('then it should call the delete service', async () => {
        expect(blogsService.delete).toHaveBeenCalledWith('clerk_123', 1);
      });
    });

    describe('When the guard reject the request', () => {
      let result: void | undefined;

      beforeEach(async () => {
        jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(false);
        await blogsController.delete('1', casted_request);
      });

      test('then it should return undefined', async () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
