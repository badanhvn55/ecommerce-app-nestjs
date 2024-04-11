import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { AllExceptionFilter } from './infrastructure/common/filter/exception.filter';
import { LoggerService } from './infrastructure/logger/logger.service';
import { ResponseFormat, ResponseInterceptor } from './infrastructure/common/interceptors/response.interceptor';
import { LoggingInterceptor } from './infrastructure/common/interceptors/logger.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const env = process.env.NODE_ENV;
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser);
  // filter
  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));
  // interceptor
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
  app.useGlobalInterceptors(new ResponseInterceptor());

  // base routing
  app.setGlobalPrefix('api_v1');

  // swagger config
  if (env !== 'production') {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Clean Architecture Nestjs')
      .setDescription('Example with todo list')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [ResponseFormat],
      deepScanRoutes: true
    });
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(3000);
}
bootstrap();
