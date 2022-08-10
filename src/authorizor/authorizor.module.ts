import { Module } from '@nestjs/common';
import { AuthorizorController } from './authorizor.controller';
import { AuthorizorService } from './authorizor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { APIKey } from './entities/APIKey.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, APIKey])],
  providers: [AuthorizorService],
  controllers: [AuthorizorController],
})
export class AuthorizorModule {}
