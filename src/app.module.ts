import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizorController } from './authorizor/authorizor.controller';
import { AuthorizorService } from './authorizor/authorizor.service';
import { APIKey } from './authorizor/entities/APIKey.entity';
import { User } from './authorizor/entities/user.entity';
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
      entities: [APIKey, User],
      synchronize: true,
    }),
    AuthorizorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
