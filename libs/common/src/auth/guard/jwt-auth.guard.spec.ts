import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ExecutionContext, HttpException } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAuthGuard],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
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
    expect(await guard.canActivate(context)).rejects.toThrow(HttpException);
  });
});
