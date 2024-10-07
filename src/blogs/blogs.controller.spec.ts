import { Test, TestingModule } from '@nestjs/testing';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard, ClerkRequest, DatabaseModule } from '@libs/common';
import { blog_dto, mockBlogsService } from '@libs/blog-contracts';

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

      expect(await blogsController.findAll()).toBeUndefined();
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
});
