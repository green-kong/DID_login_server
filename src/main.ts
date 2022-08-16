import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import * as nunjucks from 'nunjucks';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const express = app.getHttpAdapter().getInstance();

  const views = join(__dirname, '..', 'views');

  app.use(cookieParser());

  app.useStaticAssets(join(__dirname, '..', 'assets'));
  app.setBaseViewsDir(views);

  nunjucks.configure(views, { express });
  app.setViewEngine('html');

  await app.listen(3000);
}
bootstrap();
