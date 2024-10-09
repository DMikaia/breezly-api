import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@libs/common';
import { ClerkHttpGuard, Data } from '@libs/clerk-contracts';
import { UserDto } from '@libs/user-contracts';
import { UsersService } from './users.service';
import { ClerkService } from './clerk.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly clerkService: ClerkService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(ClerkHttpGuard)
  @HttpCode(HttpStatus.OK)
  @Post('clerk')
  async handleClerkEvent(@Body() body: Data): Promise<void> {
    try {
      return await this.clerkService.handleClerkEvent(body);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<UserDto[]> {
    try {
      return await this.usersService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number): Promise<UserDto> {
    try {
      return await this.usersService.findOne(id);
    } catch (error) {
      throw error;
    }
  }
}
