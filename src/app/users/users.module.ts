import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersTokensModule } from '../users-tokens/users-tokens.module';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity
    ]),
    UsersTokensModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}