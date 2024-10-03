import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.use(cookieParser());
  app.use(helmet());
  app.setGlobalPrefix('api/v1');

  await app.listen(configService.get<number>('GATEWAY_PORT'));
}
bootstrap();
