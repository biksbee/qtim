import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersTokensTypesEntity } from '../users-tokens/entities/users-tokens-types.entity';
import { UsersTokensEntity } from '../users-tokens/entities/users-tokens.entity';
import { UsersEntity } from '../users/users.entity';
import { ArticlesEntity } from '../articles/articles.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [
          UsersTokensTypesEntity,
          UsersTokensEntity,
          UsersEntity,
          ArticlesEntity,
        ],
        logging: true,
        synchronize: false,
      })
    }),
  ],
  exports: [],
})
export class DatabaseModule {}