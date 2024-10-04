import { Test, TestingModule } from '@nestjs/testing';
import { mapped_user } from '@libs/user-contracts';
import { ClerkService } from './clerk.service';
import { UsersService } from './users.service';
import { mockUsersService } from '@libs/user-contracts';
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

  describe('handleClerkEvent', () => {
    it('user.created: should create a new user', async () => {
      mockUsersService.createUser.mockReturnValue(undefined);

      await clerkService.handleClerkEvent(create_body);

      expect(mockUsersService.createUser).toHaveBeenCalledWith(mapped_user);
    });

    it('user.updated: should update an existing user', async () => {
      mockUsersService.updateUser.mockReturnValue(undefined);

      await clerkService.handleClerkEvent(update_body);

      expect(mockUsersService.updateUser).toHaveBeenCalledWith(mapped_user);
    });

    it('user.deleted: should delete an existing user', async () => {
      mockUsersService.deleteUser.mockReturnValue(undefined);

      await clerkService.handleClerkEvent(delete_body);

      expect(mockUsersService.deleteUser).toHaveBeenCalledWith(
        mapped_user.clerk_id,
      );
    });

    it('random.event: should throw a bad request when the event is not recognized', async () => {
      await expect(clerkService.handleClerkEvent(wrong_body)).rejects.toThrow(
        'Invalid event type',
      );
    });
  });

  describe('mapUser', () => {
    it('should return a mapped user data', () => {
      const result = clerkService.mapUser(create_body.data as ClerkUser);

      expect(result).toEqual(mapped_user);
    });
  });
});
