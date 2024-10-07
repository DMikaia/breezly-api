import { Test, TestingModule } from '@nestjs/testing';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard, blogs, ClerkRequest, DatabaseModule } from '@libs/common';
import { blog, blog_dto, mockBlogsService } from '@libs/blog-contracts';

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

  describe('Create', () => {
    it('Should throw an unauthorized error with an undefined result', async () => {
      jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(false);

      const req: unknown = {
        cookies: { session_id: 'session_123' },
        clerk_id: 'clerK_123',
        body: blog_dto,
        get: jest.fn(),
        header: jest.fn(),
      };

      const casted_request = req as ClerkRequest;

      expect(await blogsController.create(casted_request)).toBeUndefined();
    });

    it('should create a new blog', async () => {
      jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
      mockBlogsService.create.mockReturnValue(undefined);

      const req: unknown = {
        cookies: { session_id: 'session_123' },
        clerk_id: 'clerK_123',
        body: blog_dto,
        get: jest.fn(),
        header: jest.fn(),
      };

      const casted_request = req as ClerkRequest;

      expect(await blogsController.create(casted_request)).toBeUndefined();
      expect(blogsService.create).toHaveBeenCalledWith(
        casted_request.clerk_id,
        casted_request.body,
      );
    });
  });

  describe('Find all', () => {
    it('Should throw an unauthorized error with an undefined result', async () => {
      jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(false);

      expect(await blogsController.findAll()).toBeUndefined();
    });

    it('should return a list of blog', async () => {
      jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
      mockBlogsService.findAll.mockReturnValue(blogs);

      const result = await blogsController.findAll();

      expect(result).toEqual(blogs);
      expect(blogsService.findAll).toHaveBeenCalled();
    });
  });

  describe('Find one', () => {
    it('Should throw an unauthorized error with an undefined result', async () => {
      jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(false);

      expect(await blogsController.findOne('1')).toBeUndefined();
    });

    it('Should throw in the response a 404 and return undefined to the controller', async () => {
      jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
      mockBlogsService.findOne.mockReturnValue(undefined);

      const result = await blogsController.findOne('1');

      expect(result).toBeUndefined();
      expect(blogsService.findOne).toHaveBeenCalledWith(1);
    });

    it('Should return a blog', async () => {
      jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
      mockBlogsService.findOne.mockReturnValue(blog);

      const result = await blogsController.findOne('1');

      expect(result).toEqual(blog);
      expect(blogsService.findOne).toHaveBeenCalledWith(1);
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

    it('Should throw an unauthorized error with an undefined result', async () => {
      jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(false);

      expect(await blogsController.update('1', casted_request)).toBeUndefined();
    });

    it('Should throw in the response an http exception when the operation failed either 404 or 403', async () => {
      jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
      mockBlogsService.findOne.mockReturnValue(undefined);

      const result = await blogsController.update('1', casted_request);

      expect(result).toBeUndefined();
      expect(blogsService.update).toHaveBeenCalledWith(
        'clerk_123',
        casted_request.body,
      );
    });

    it('Should send 200 response and return undefined to the controller', async () => {
      jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
      mockBlogsService.update.mockReturnValue(undefined);

      const result = await blogsController.update('1', casted_request);

      expect(result).toBeUndefined();
      expect(blogsService.update).toHaveBeenCalledWith(
        'clerk_123',
        casted_request.body,
      );
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

    it('Should throw an unauthorized error with an undefined result that the controller receives', async () => {
      jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(false);

      expect(await blogsController.delete('1', casted_request)).toBeUndefined();
    });

    it('Should throw in the response an http exception when the operation failed either 404 or 403', async () => {
      jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
      mockBlogsService.delete.mockReturnValue(undefined);

      const result = await blogsController.delete('1', casted_request);

      expect(result).toBeUndefined();
      expect(blogsService.delete).toHaveBeenCalledWith('clerk_123', 1);
    });

    it('Should send 200 response and remove the blog and return undefined to the controller', async () => {
      jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
      mockBlogsService.delete.mockReturnValue(undefined);

      const result = await blogsController.delete('1', casted_request);

      expect(result).toBeUndefined();
      expect(blogsService.delete).toHaveBeenCalledWith('clerk_123', 1);
    });
  });
});
