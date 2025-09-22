import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FingerprintMiddleware } from './modules/middleware/fingerprint.middleware';
import { DatabaseModule } from './app/database/database.module';
import { AuthModule } from './app/auth/auth.module';
import { UsersModule } from './app/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './app/auth/guards/auth.guard';
import { UsersTokensModule } from './app/users-tokens/users-tokens.module';
import { ArticlesModule } from './app/articles/articles.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    DatabaseModule,
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          stores: [
            new KeyvRedis(`redis://${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`),
          ]
        }
      },
    }),
    AuthModule,
    UsersModule,
    UsersTokensModule,
    ArticlesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FingerprintMiddleware).forRoutes('*');
  }
}
