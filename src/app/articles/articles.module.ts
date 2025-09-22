import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesEntity } from './articles.entity';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [ArticlesService],
  controllers: [ArticlesController],
  imports: [
    TypeOrmModule.forFeature([
      ArticlesEntity,
    ]),
    UsersModule,
  ],
  exports: [ArticlesService],
})
export class ArticlesModule {}