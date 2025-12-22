import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Exnaton Energy Monitoring API')
    .setDescription('API for monitoring energy production and consumption data')
    .setVersion('1.0')
    .addTag('meterdata', 'Meter data operations')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-Tenant-ID',
        in: 'header',
        description: 'Tenant identifier for multi-tenant access',
      },
      'X-Tenant-ID',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const host = configService.get<string>('HOST');
  const port = configService.get<number>('NEXT_PUBLIC_API_PORT', 3001);

  await app.listen(port);
  console.log(`Application is running on: http://${host}:${port}`);
  console.log(`Swagger docs available at: http://${host}:${port}/api/docs`);
}
bootstrap();
