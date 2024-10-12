import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DATABASE_CONNECTION } from '@libs/common';
import { mapped_user } from '@libs/user-contracts';
import { eq } from 'drizzle-orm';
import * as schema from '@libs/common/schema/users';
import { NotFoundException } from '@nestjs/common';

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

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('Find One', () => {
    const mockUser = {
      id: 1,
      clerk_id: 'clerk_1',
      email: 'user@example.com',
    };

    describe('When find one is called', () => {
      let user: typeof mockUser;

      beforeEach(async () => {
        mockDatabase.query.users.findFirst.mockResolvedValue(mockUser);
        user = await usersService.findOne(1);
      });

      test('then it should call the database to find the user', async () => {
        expect(mockDatabase.query.users.findFirst).toHaveBeenCalledWith({
          where: eq(schema.users.id, 1),
        });
      });

      test('then it should return the user', async () => {
        expect(user).toEqual(mockUser);
      });
    });

    describe('should throw a not found exception if the user does not exist', () => {
      beforeEach(async () => {
        mockDatabase.query.users.findFirst.mockResolvedValue(null);
        await expect(usersService.findOne(1)).rejects.toThrow(
          NotFoundException,
        );
      });

      test('then it should call the database to find the user', async () => {
        expect(mockDatabase.query.users.findFirst).toHaveBeenCalledWith({
          where: eq(schema.users.id, 1),
        });
      });
    });
  });

  describe('Find All', () => {
    const mockUsers = [
      { id: 1, clerk_id: 'clerk_1', email: 'user@example.com' },
    ];

    describe('When find all is called', () => {
      let users: typeof mockUsers;

      beforeEach(async () => {
        mockDatabase.query.users.findMany.mockResolvedValue(mockUsers);
        users = await usersService.findAll();
      });

      test('then it should call the database to find all the users', async () => {
        expect(mockDatabase.query.users.findMany).toHaveBeenCalledTimes(1);
      });

      test('then it should return the list of users', async () => {
        expect(users).toEqual(mockUsers);
      });
    });
  });

  describe('Create', () => {
    describe('should insert a user into the database', () => {
      beforeEach(async () => {
        await usersService.createUser(mapped_user);
      });

      test('the it should call the database to create the user', async () => {
        expect(mockDatabase.insert).toHaveBeenCalledWith(schema.users);
        expect(mockDatabase.insert().values).toHaveBeenCalledWith(mapped_user);
      });
    });
  });

  describe('Update', () => {
    describe('should update a user in the database', () => {
      beforeEach(async () => {
        await usersService.updateUser(mapped_user);
      });

      test('then is should call the database to update the user', () => {
        expect(mockDatabase.update).toHaveBeenCalledWith(schema.users);
        expect(mockDatabase.update().set).toHaveBeenCalledWith(mapped_user);
        expect(mockDatabase.update().set().where).toHaveBeenCalledWith(
          eq(schema.users.clerk_id, mapped_user.clerk_id),
        );
      });
    });
  });

  describe('Delete', () => {
    describe('should delete a user in the database', () => {
      beforeEach(async () => {
        await usersService.deleteUser(mapped_user.clerk_id);
      });

      test('then it should call the database to delete the user', () => {
        expect(mockDatabase.delete).toHaveBeenCalledWith(schema.users);
        expect(mockDatabase.delete().where).toHaveBeenCalledWith(
          eq(schema.users.clerk_id, mapped_user.clerk_id),
        );
      });
    });
  });
});
