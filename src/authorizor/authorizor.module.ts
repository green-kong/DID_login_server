import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { AuthorizorController } from './authorizor.controller';
import { AuthorizorService } from './authorizor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Login } from './entities/login.entity';
// import { APIKey } from './entities/APIKey.entity';
import { application } from './entities/application.entity';
import { connected } from './entities/connected.entity';
import { user } from './entities/user.entity';

export const cacheModule = CacheModule.registerAsync({
  useFactory: async () => ({
    store: redisStore,
    host: 'localhost',
    port: '6379',
    ttl: 0,
  }),
});

@Module({
  imports: [
    TypeOrmModule.forFeature([Login], 'test'),
    TypeOrmModule.forFeature([application, connected, user], 'DID'),
    cacheModule,
  ],
  providers: [AuthorizorService],
  controllers: [AuthorizorController],
})
export class AuthorizorModule {}
