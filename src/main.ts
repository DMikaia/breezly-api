import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from '@libs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.use(cookieParser());
  app.use(helmet());
  app.setGlobalPrefix('api/v1');

  const httpAdapterHost = app.get<HttpAdapterHost>(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  await app.listen(configService.get<number>('GATEWAY_PORT'));
}
bootstrap();
