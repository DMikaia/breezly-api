import { AuthGuard, ClerkRequest, HttpExceptionFilter } from '@libs/common';
import { CommentsService } from './comments.service';
import { CommentDto } from '@libs/comment-contracts';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';

@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(@Req() req: ClerkRequest): Promise<void> {
    return await this.commentsService.create({
      user_id: req.clerk_id,
      ...req.body,
    });
  }

  @Get()
  async findAll(
    @Body() data: { blog_id: number; limit: number; offset: number },
  ): Promise<CommentDto[]> {
    return await this.commentsService.findAll(data);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseIntPipe()) id: number) {
    return await this.commentsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Req() req: ClerkRequest,
  ): Promise<void> {
    return this.commentsService.update({
      id,
      user_id: req.clerk_id,
      ...req.body,
    });
  }

  @Delete(':id')
  async delete(
    @Param('id', new ParseIntPipe()) id: number,
    @Req() req: ClerkRequest,
  ): Promise<void> {
    return this.commentsService.delete({ id, user_id: req.clerk_id });
  }
}
