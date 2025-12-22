import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
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

  await app.listen(process.env.PORT ?? 3001);
  console.log(`Application is running on: http://${process.env.BASE_URL}:${process.env.NEST_PORT}`);
  console.log(`Swagger docs available at: http://${process.env.BASE_URL}:${process.env.NEST_PORT}/api/docs`);
}
bootstrap();
