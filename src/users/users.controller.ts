import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@libs/common';
import { ClerkHttpGuard, Data } from '@libs/clerk-contracts';
import { UsersService } from './users.service';
import { ClerkService } from './clerk.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly clerkService: ClerkService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  async getUsers() {
    return await this.usersService.getUsers();
  }

  @UseGuards(ClerkHttpGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/clerk')
  async handleClerkEvent(@Body() body: Data) {
    return await this.clerkService.handleClerkEvent(body);
  }
}
