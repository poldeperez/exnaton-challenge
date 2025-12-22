import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeterModule } from './meterdata/meterdata.module';
import { CacheModule } from '@nestjs/cache-manager';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // dev only
      }),
    }),
    MeterModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {

        try {
          const redisUrl = `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`;
          
          const keyvRedis = new KeyvRedis(redisUrl);
          const keyv = new Keyv({ store: keyvRedis });

          // Test connection
          await keyv.set('test', 'connection');
          const test = await keyv.get('test');
          await keyv.delete('test');

          console.log('Redis connection successful:', test === 'connection');

          return {
            stores: [keyv],
            ttl: 300000, // 5 minutes in milliseconds for cache-manager v6
          };
        } catch (error) {
          console.error('Failed to create Redis store:', error);
          throw error;
        }
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}