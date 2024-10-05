import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { Blog } from '@libs/blog-contracts';
import { ClerkRequest, AuthGuard } from '@libs/common';

@UseGuards(AuthGuard)
@Controller('blogs')
export class BlogsController {
  private readonly logger = new Logger(BlogsController.name);

  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  create(@Body() blog: Blog) {
    return this.blogsService.create(blog);
  }

  @Get()
  findAll(@Req() req: ClerkRequest) {
    this.logger.log(req.clerk_id);

    return this.blogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: ClerkRequest,
    @Body() blog: Blog,
  ) {
    this.logger.log(req.clerk_id);

    return this.blogsService.update(+id, req.clerk_id, blog);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: ClerkRequest) {
    this.logger.log(req.clerk_id);

    return this.blogsService.remove(+id, req.clerk_id);
  }
}
