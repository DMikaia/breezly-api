import { Test, TestingModule } from '@nestjs/testing';
import { ClerkHttpGuard } from './clerk.http.guard';
import { ExecutionContext, HttpException } from '@nestjs/common';
import { ValidationStrategy } from '../strategy/validation.strategy';

describe('ClerkHttpGuard', () => {
  let clerkHttpGuard: ClerkHttpGuard;
  let validationStrategy: ValidationStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClerkHttpGuard,
        {
          provide: 'ValidationStrategy',
          useValue: {
            validate: jest.fn(),
          },
        },
      ],
    }).compile();

    clerkHttpGuard = module.get<ClerkHttpGuard>(ClerkHttpGuard);
    validationStrategy = module.get<ValidationStrategy>('ValidationStrategy');
  });

  const mockExecutionContext = {
    switchToHttp: () => ({
      getRequest: () => ({
        body: { some: 'data' },
        headers: {
          'svix-id': 'test-id',
          'svix-timestamp': 'test-timestamp',
          'svix-signature': 'test-signature',
        },
      }),
    }),
  };

  it('should be defined', () => {
    expect(clerkHttpGuard).toBeDefined();
  });

  it('should return true if verification passes', async () => {
    jest.spyOn(validationStrategy, 'validate').mockReturnValue(true);

    const result = await clerkHttpGuard.canActivate(
      mockExecutionContext as ExecutionContext,
    );

    expect(validationStrategy.validate).toHaveBeenCalledWith({
      body: { some: 'data' },
      headers: {
        svix_id: 'test-id',
        svix_timestamp: 'test-timestamp',
        svix_signature: 'test-signature',
      },
    });
    expect(result).toBe(true);
  });

  it('should throw an HttpException if verification fails', async () => {
    jest.spyOn(validationStrategy, 'validate').mockReturnValue(false);

    expect(
      clerkHttpGuard.canActivate(mockExecutionContext as ExecutionContext),
    ).rejects.toThrow(HttpException);

    expect(validationStrategy.validate).toHaveBeenCalledWith({
      body: { some: 'data' },
      headers: {
        svix_id: 'test-id',
        svix_timestamp: 'test-timestamp',
        svix_signature: 'test-signature',
      },
    });
  });
});
