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
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment, CommentDto } from '@libs/comment-contracts';
import { AuthGuard, ClerkRequest } from '@libs/common';

@UseGuards(AuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(@Body() comment: Comment): Promise<void> {
    return await this.commentsService.create(comment);
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
      blog_id: id,
      user_id: req.clerk_id,
      content: req.body.content,
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
