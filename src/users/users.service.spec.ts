import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DATABASE_CONNECTION } from '@libs/common';
import { mapped_user } from '@libs/user-contracts';
import { eq } from 'drizzle-orm';
import * as schema from '@libs/common/schema/users';

const mockDatabase = {
  query: {
    users: {
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

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        { id: 1, clerk_id: 'clerk_1', email: 'user@example.com' },
      ];
      mockDatabase.query.users.findMany.mockResolvedValue(mockUsers);

      const users = await usersService.findAll();

      expect(users).toEqual(mockUsers);
      expect(mockDatabase.query.users.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a user with the provided user id', async () => {
      const mockUser = {
        id: 1,
        clerk_id: 'clerk_1',
        email: 'user@example.com',
      };

      mockDatabase.query.users.findFirst.mockResolvedValue(mockUser);

      const users = await usersService.findOne(1);

      expect(users).toEqual(mockUser);
      expect(mockDatabase.query.users.findFirst).toHaveBeenCalledWith({
        where: eq(schema.users.id, 1),
      });
    });
  });

  describe('createUser', () => {
    it('should insert a user into the database', async () => {
      await usersService.createUser(mapped_user);

      expect(mockDatabase.insert).toHaveBeenCalledWith(schema.users);
      expect(mockDatabase.insert().values).toHaveBeenCalledWith(mapped_user);
    });
  });

  describe('updateUser', () => {
    it('should update a user in the database', async () => {
      await usersService.updateUser(mapped_user);

      expect(mockDatabase.update).toHaveBeenCalledWith(schema.users);
      expect(mockDatabase.update().set).toHaveBeenCalledWith(mapped_user);
      expect(mockDatabase.update().set().where).toHaveBeenCalledWith(
        eq(schema.users.clerk_id, mapped_user.clerk_id),
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user in the database', async () => {
      await usersService.deleteUser(mapped_user.clerk_id);

      expect(mockDatabase.delete).toHaveBeenCalledWith(schema.users);
      expect(mockDatabase.delete().where).toHaveBeenCalledWith(
        eq(schema.users.clerk_id, mapped_user.clerk_id),
      );
    });
  });
});
