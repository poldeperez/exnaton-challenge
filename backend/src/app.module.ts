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
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    MeterModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        try {
          const redisHost = configService.get<string>('REDIS_HOST') || 'localhost';
          const redisPort = configService.get<number>('REDIS_PORT') || 6379;
          const redisUrl = `redis://${redisHost}:${redisPort}`;
          
          console.log('Redis URL:', redisUrl);
          
          const keyvRedis = new KeyvRedis(redisUrl);
          const keyv = new Keyv({ store: keyvRedis });

          // Test connection
          await keyv.set('test', 'connection');
          const test = await keyv.get('test');
          await keyv.delete('test');

          console.log('Redis connection successful:', test === 'connection');

          return {
            stores: [keyv],
            ttl: 300000, // 5 minutes in milliseconds
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