import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { AuthorizorController } from './authorizor.controller';
import { AuthorizorService } from './authorizor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Login } from './entities/login.entity';
import { APIKey } from './entities/APIKey.entity';

export const cacheModule = CacheModule.registerAsync({
  useFactory: async () => ({
    store: redisStore,
    host: 'localhost',
    port: '6379',
    ttl: 0,
  }),
});

@Module({
  imports: [TypeOrmModule.forFeature([Login, APIKey]), cacheModule],
  providers: [AuthorizorService],
  controllers: [AuthorizorController],
})
export class AuthorizorModule {}
