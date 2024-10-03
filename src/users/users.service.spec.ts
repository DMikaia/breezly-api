import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DATABASE_CONNECTION } from '@libs/common';
import { User } from '@libs/user-contracts';
import * as schema from '@libs/common/schema/users';
import { eq } from 'drizzle-orm';

const mockDatabase = {
  query: {
    users: {
      findMany: jest.fn(),
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
};

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DATABASE_CONNECTION,
          useValue: mockDatabase,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        { id: 1, clerk_id: 'clerk_1', email: 'user@example.com' },
      ];
      mockDatabase.query.users.findMany.mockResolvedValue(mockUsers);

      const users = await usersService.getUsers();

      expect(users).toEqual(mockUsers);
      expect(mockDatabase.query.users.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('createUser', () => {
    it('should insert a user into the database', async () => {
      const user: User = {
        clerk_id: 'clerk_1',
        email: 'user@example.com',
        username: 'user123',
        first_name: 'John',
        last_name: 'Doe',
        profile_image_url: 'http://example.com/image.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      };

      await usersService.createUser(user);

      expect(mockDatabase.insert).toHaveBeenCalledWith(schema.users);
      expect(mockDatabase.insert().values).toHaveBeenCalledWith(user);
    });
  });

  describe('updateUser', () => {
    it('should update a user in the database', async () => {
      const user: User = {
        clerk_id: 'clerk_1',
        email: 'user@example.com',
        username: 'user123',
        first_name: 'John',
        last_name: 'Doe',
        profile_image_url: 'http://example.com/image.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      };

      await usersService.updateUser(user);

      expect(mockDatabase.update).toHaveBeenCalledWith(schema.users);
      expect(mockDatabase.update().set).toHaveBeenCalledWith(user);
      expect(mockDatabase.update().set().where).toHaveBeenCalledWith(
        eq(schema.users.clerk_id, user.clerk_id),
      );
    });
  });
});
