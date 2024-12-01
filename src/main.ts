import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  // Validation setup
  app.useGlobalPipes(
    new ValidationPipe()
  );
  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('Vipul Waghmare APIs')
    .setDescription('All the APIs created')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
