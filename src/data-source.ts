import { DataSource } from 'typeorm';
import * as dotenv from "dotenv";
import { UsersTokensTypesEntity } from './app/users-tokens/entities/users-tokens-types.entity';
import { UsersTokensEntity } from './app/users-tokens/entities/users-tokens.entity';
import { UsersEntity } from './app/users/users.entity';
import { ArticlesEntity } from './app/articles/articles.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    UsersTokensTypesEntity,
    UsersTokensEntity,
    UsersEntity,
    ArticlesEntity,
  ],
  migrations: ['src/app/database/migrations/*.ts'],
  migrationsTableName: 'migration_table',
  synchronize: false,
})