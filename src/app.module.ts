import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APIKey } from './authorizor/entities/APIKey.entity';
import { Login } from './authorizor/entities/login.entity';
import { AuthorizorModule } from './authorizor/authorizor.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'dev_kong',
      password: 'qwer1234',
      database: 'test',
      entities: [APIKey, Login],
      synchronize: true,
    }),
    AuthorizorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
