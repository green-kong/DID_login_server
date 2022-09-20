import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import cors from 'cors';
import * as nunjucks from 'nunjucks';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const express = app.getHttpAdapter().getInstance();

  const views = process.env.NODE_ENV
    ? join(__dirname, '..', '..', 'views')
    : join(__dirname, '..', 'views');

  const staticPath = process.env.NODE_ENV
    ? join(__dirname, '..', '..', 'assets')
    : join(__dirname, '..', 'assets');
  app.use(cors({ origin: true, credential: true }));
  app.use(cookieParser());

  app.useStaticAssets(staticPath);
  app.setBaseViewsDir(views);

  nunjucks.configure(views, { express });
  app.setViewEngine('html');

  await app.listen(8000);
}
bootstrap();
