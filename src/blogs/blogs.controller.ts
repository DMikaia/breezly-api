import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { ClerkRequest, AuthGuard } from '@libs/common';

@UseGuards(AuthGuard)
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  create(@Req() req: ClerkRequest) {
    return this.blogsService.create(req.clerk_id, req.body);
  }

  @Get()
  findAll() {
    return this.blogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Req() req: ClerkRequest) {
    return this.blogsService.update(req.clerk_id, { id: +id, ...req.body });
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: ClerkRequest) {
    return this.blogsService.delete(req.clerk_id, +id);
  }
}
