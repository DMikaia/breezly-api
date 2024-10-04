import { Test, TestingModule } from '@nestjs/testing';
import { ClerkService } from './clerk.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule, JwtAuthGuard } from '@libs/common';
import { ConfigModule } from '@nestjs/config';
import { mockUsersService } from '@libs/user-contracts';
import {
  ClerkEventModule,
  create_body,
  wrong_body,
  ClerkHttpGuard,
} from '@libs/clerk-contracts';

const mockClerkService = {
  handleClerkEvent: jest.fn(),
};

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let clerkService: ClerkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
        ClerkEventModule,
        DatabaseModule,
      ],
      controllers: [UsersController],
      providers: [
        { provide: ClerkService, useValue: mockClerkService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    clerkService = module.get<ClerkService>(ClerkService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('getUsers', () => {
    it('should throw an unauthorized error with an undefined result', async () => {
      jest
        .spyOn(JwtAuthGuard.prototype, 'canActivate')
        .mockResolvedValue(false);

      expect(await usersController.getUsers()).toEqual(undefined);
    });

    it('should return a 200 status with the list of users', async () => {
      jest.spyOn(JwtAuthGuard.prototype, 'canActivate').mockResolvedValue(true);
      mockUsersService.getUsers.mockReturnValue({
        id: 1,
        clerk_id: 'clerk_1',
        email: 'user@example.com',
      });

      expect(await usersController.getUsers()).toEqual({
        id: 1,
        clerk_id: 'clerk_1',
        email: 'user@example.com',
      });
      expect(usersService.getUsers).toHaveBeenCalled();
    });
  });

  describe('handleClerkEvent', () => {
    it('should throw an unauthorized error with an undefined result', async () => {
      jest
        .spyOn(ClerkHttpGuard.prototype, 'canActivate')
        .mockResolvedValue(false);

      expect(await usersController.handleClerkEvent(create_body)).toEqual(
        undefined,
      );
    });

    it('should throw a bad request error with an undefined result', async () => {
      jest
        .spyOn(ClerkHttpGuard.prototype, 'canActivate')
        .mockResolvedValue(true);

      mockClerkService.handleClerkEvent.mockReturnValue(undefined);
      expect(await usersController.handleClerkEvent(wrong_body)).toEqual(
        undefined,
      );
    });

    it('should return a 200 status if the request is successful with an undefined result', async () => {
      jest
        .spyOn(ClerkHttpGuard.prototype, 'canActivate')
        .mockResolvedValue(true);
      mockClerkService.handleClerkEvent.mockReturnValue(undefined);

      expect(await usersController.handleClerkEvent(create_body)).toEqual(
        undefined,
      );
      expect(clerkService.handleClerkEvent).toHaveBeenCalledWith(create_body);
    });
  });
});
