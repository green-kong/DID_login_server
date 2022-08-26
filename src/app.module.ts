import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Login } from './authorizor/entities/login.entity';
import { AuthorizorModule } from './authorizor/authorizor.module';
import { application } from './authorizor/entities/application.entity';
import { connected } from './authorizor/entities/connected.entity';
import { user } from './authorizor/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'test',
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'dev_kong',
      password: 'qwer1234',
      database: 'test',
      entities: [Login],
      synchronize: false,
    }),
    TypeOrmModule.forRoot({
      name: 'DID',
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'dev_kong',
      password: 'qwer1234',
      database: 'DID',
      entities: [application, connected, user],
      synchronize: false,
    }),
    AuthorizorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
