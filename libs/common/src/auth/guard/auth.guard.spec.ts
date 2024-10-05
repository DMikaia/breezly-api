import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if authenticated', async () => {
    const context = {} as ExecutionContext;
    jest.spyOn(guard, 'canActivate').mockResolvedValue(true);
    expect(await guard.canActivate(context)).toBe(true);
  });

  it('should return false if not authenticated', async () => {
    const context = {} as ExecutionContext;
    jest.spyOn(guard, 'canActivate').mockResolvedValue(false);
    expect(await guard.canActivate(context)).toBe(false);
  });
});
