import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';

import { APIKey } from './entities/APIKey.entity';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthorizorService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(APIKey)
    private APIKeyRepository: Repository<APIKey>,
  ) {}

  async checkAPIKey(clientId: string, host: string): Promise<boolean> {
    const registered = await this.APIKeyRepository.findOne({
      where: { APIKey: clientId, host },
    });
    if (registered && clientId) {
      return true;
    } else {
      false;
    }
  }

  async checkUser({ userId, userPw }: LoginDto): Promise<boolean> {
    // TODO : DB조회가 아닌 contract 조회로 변경해야함
    const secret = 'helpless';
    const hash = crypto
      .createHmac('sha256', secret)
      .update(userId + userPw)
      .digest('hex');

    const user = await this.userRepository.findOne({
      where: { hash },
    });
    if (user) {
      return true;
    } else {
      return false;
    }
  }
}
