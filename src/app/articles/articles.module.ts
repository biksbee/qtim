import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';

@Module({
  providers: [ArticleService],
  controllers: [ArticleController],
  imports: [],
  exports: [ArticleService],
})
export class ArticleModule {}