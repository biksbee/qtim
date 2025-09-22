import { UsersTokensService } from './users-tokens.service';
import { UsersTokensEntity } from './entities/users-tokens.entity';
import { UsersTokensTypesEntity } from './entities/users-tokens-types.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  providers: [UsersTokensService],
  imports: [
    TypeOrmModule.forFeature([
      UsersTokensEntity,
      UsersTokensTypesEntity
    ]),
  ],
  exports: [UsersTokensService],
})
export class UsersTokensModule {}