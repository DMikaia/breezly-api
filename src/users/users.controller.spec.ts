import { Test, TestingModule } from '@nestjs/testing';
import { ClerkService } from './clerk.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule, AuthGuard } from '@libs/common';
import { ConfigModule } from '@nestjs/config';
import { mockUsersService } from '@libs/user-contracts';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

  describe('findAll', () => {
    const mock_data = {
      id: 1,
      clerk_id: 'clerk_1',
      email: 'user@example.com',
    };

    describe('When the find all is called', () => {
      let result: (typeof mock_data)[];

      beforeEach(async () => {
        jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
        mockUsersService.findAll.mockReturnValue([mock_data]);
        result = await usersController.findAll();
      });

      test('then it should call the find all service', async () => {
        expect(usersService.findAll).toHaveBeenCalled();
      });

      test('then it should return the list of users', async () => {
        expect(result).toEqual([mock_data]);
      });
    });

    describe('When the guard rejects the request', () => {
      let result: undefined | (typeof mock_data)[];

      beforeEach(async () => {
        jest
          .spyOn(AuthGuard.prototype, 'canActivate')
          .mockRejectedValue(new UnauthorizedException('Unauthorized'));
        mockUsersService.findAll.mockReturnValue(undefined);
        result = await usersController.findAll();
      });

      test('then it should return undefined', async () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('findOne', () => {
    const mock_data = {
      id: 1,
      clerk_id: 'clerk_1',
      email: 'user@example.com',
    };

    describe('When find one is called', () => {
      let result: typeof mock_data;

      beforeEach(async () => {
        jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
        mockUsersService.findOne.mockReturnValue(mock_data);

        result = await usersController.findOne(1);
      });

      test('then it should call the find one service', async () => {
        expect(usersService.findOne).toHaveBeenCalledWith(1);
      });

      test('then it should return the user', async () => {
        expect(result).toEqual(mock_data);
      });
    });

    describe('When the user is not found', () => {
      beforeEach(async () => {
        jest.spyOn(AuthGuard.prototype, 'canActivate').mockResolvedValue(true);
        mockUsersService.findOne.mockRejectedValue(
          new NotFoundException('User not found'),
        );
      });

      test('then it should throw a not found exception', async () => {
        await expect(usersController.findOne(1)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('When the guard rejects the request', () => {
      let result: undefined | typeof mock_data;

      beforeEach(async () => {
        jest
          .spyOn(AuthGuard.prototype, 'canActivate')
          .mockRejectedValue(new UnauthorizedException('Unauthorized'));
        mockUsersService.findOne.mockReturnValue(undefined);
        result = await usersController.findOne(1);
      });

      test('then it should return undefined', async () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('handleClerkEvent', () => {
    describe('When handle clerk event is called', () => {
      let result: void | undefined;

      beforeEach(async () => {
        jest
          .spyOn(ClerkHttpGuard.prototype, 'canActivate')
          .mockResolvedValue(true);
        mockClerkService.handleClerkEvent.mockReturnValue(undefined);

        result = await usersController.handleClerkEvent(create_body);
      });

      test('then it should call the hand clerk event service', async () => {
        expect(clerkService.handleClerkEvent).toHaveBeenCalledWith(create_body);
      });

      test('then it should return undefined on success', async () => {
        expect(result).toBeUndefined();
      });
    });

    describe('When it is a bad request', () => {
      beforeEach(async () => {
        jest
          .spyOn(ClerkHttpGuard.prototype, 'canActivate')
          .mockResolvedValue(true);

        mockClerkService.handleClerkEvent.mockRejectedValue(
          new BadRequestException('Invalid event type'),
        );
      });

      test('then it should throw a bad request exception', async () => {
        await expect(
          usersController.handleClerkEvent(wrong_body),
        ).rejects.toThrow(BadRequestException);
      });
    });

    describe('When the guard rejects the request', () => {
      let result: void | undefined;

      beforeEach(async () => {
        jest
          .spyOn(ClerkHttpGuard.prototype, 'canActivate')
          .mockRejectedValue(new UnauthorizedException('Unauthorized'));
        mockClerkService.handleClerkEvent.mockReturnValue(undefined);
        result = await usersController.handleClerkEvent(create_body);
      });

      test('then it should return undefined', async () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
