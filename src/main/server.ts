import '../infra/observability/telemetry/telemetry';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import logger from '@src/infra/observability/logger/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger,
    bufferLogs: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Orders Microservice')
    .setDescription('The Orders API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Coloque aqui seu token jwt',
        in: 'header',
      },
      'Authorization', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(3003);
}
bootstrap();
