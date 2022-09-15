import dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Login } from './authorizor/entities/login.entity';
import { AuthorizorModule } from './authorizor/authorizor.module';
import { application } from './authorizor/entities/application.entity';
import { connected } from './authorizor/entities/connected.entity';
import { user } from './authorizor/entities/user.entity';
import DBconfig from '../db.config';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'test',
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: DBconfig.login.user,
      password: DBconfig.login.password,
      database: DBconfig.login.database,
      entities: [Login],
      synchronize: false,
    }),
    TypeOrmModule.forRoot({
      name: 'DID',
      type: 'mysql',
      host: DBconfig.main.host,
      port: 3306,
      username: DBconfig.main.user,
      password: DBconfig.main.password,
      database: DBconfig.main.database,
      entities: [application, connected, user],
      synchronize: false,
    }),
    AuthorizorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
