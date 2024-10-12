import { Test, TestingModule } from '@nestjs/testing';
import { mapped_user } from '@libs/user-contracts';
import { ClerkService } from './clerk.service';
import { UsersService } from './users.service';
import { mockUsersService } from '@libs/user-contracts';
import { BadRequestException } from '@nestjs/common';
import {
  ClerkUser,
  create_body,
  delete_body,
  update_body,
  wrong_body,
} from '@libs/clerk-contracts';

describe('ClerkService', () => {
  let clerkService: ClerkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClerkService,
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    clerkService = module.get<ClerkService>(ClerkService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(clerkService).toBeDefined();
  });

  describe('Handle Clerk Event', () => {
    describe('When user.created is the case', () => {
      beforeEach(async () => {
        mockUsersService.createUser.mockReturnValue(undefined);
        await clerkService.handleClerkEvent(create_body);
      });

      test('then is should call the create method from the user service', async () => {
        expect(mockUsersService.createUser).toHaveBeenCalledWith(mapped_user);
      });
    });

    describe('When user.updated is the case', () => {
      beforeEach(async () => {
        mockUsersService.updateUser.mockReturnValue(undefined);
        await clerkService.handleClerkEvent(update_body);
      });

      test('then is should call the update method from the user service', async () => {
        expect(mockUsersService.updateUser).toHaveBeenCalledWith(mapped_user);
      });
    });

    describe('When user.deleted is the case', () => {
      beforeEach(async () => {
        mockUsersService.deleteUser.mockReturnValue(undefined);
        await clerkService.handleClerkEvent(delete_body);
      });

      test('then is should call the delete method from the user service', async () => {
        expect(mockUsersService.deleteUser).toHaveBeenCalledWith(
          mapped_user.clerk_id,
        );
      });
    });

    describe('When it is not a valid event', () => {
      test('the it should throw a bad request exception', async () => {
        await expect(clerkService.handleClerkEvent(wrong_body)).rejects.toThrow(
          BadRequestException,
        );
      });
    });
  });

  describe('Map User', () => {
    describe('When map user is called', () => {
      let result: typeof mapped_user;

      beforeEach(async () => {
        result = clerkService.mapUser(create_body.data as ClerkUser);
      });

      test('then it should return a mapped user', async () => {
        expect(result).toEqual(mapped_user);
      });
    });
  });
});
