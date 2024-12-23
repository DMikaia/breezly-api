import { ClerkRequest, AuthGuard, HttpExceptionFilter } from '@libs/common';
import { BlogsService } from './blogs.service';
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  UseFilters,
} from '@nestjs/common';

@UseFilters(HttpExceptionFilter)
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
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.blogsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Req() req: ClerkRequest,
  ) {
    return this.blogsService.update(req.clerk_id, { id: +id, ...req.body });
  }

  @Delete(':id')
  delete(
    @Param('id', new ParseIntPipe()) id: number,
    @Req() req: ClerkRequest,
  ) {
    return this.blogsService.delete(req.clerk_id, +id);
  }
}
