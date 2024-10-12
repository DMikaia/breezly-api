import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { DatabaseModule } from '@libs/common';

@Module({
  imports: [DatabaseModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
