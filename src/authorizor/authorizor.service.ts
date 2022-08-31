import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { v4 } from 'uuid';
import dotenv from 'dotenv';

import { Login } from './entities/login.entity';
import { LoginDto } from './dto/login.dto';
import { CodeDto } from './dto/code.dto';
import { getDeployed } from 'src/utils/connectDeployed';
import { Jwt } from '../utils/jwt';
import { TokenDto } from './dto/token.dto';
import { LoginResultDto } from './dto/loginResult.dto';
import { UserInfoDto } from './dto/user.dto';
import { TokensDto } from './dto/tokens.dto';
import { application } from './entities/application.entity';
import { connected } from './entities/connected.entity';
import { user } from './entities/user.entity';

dotenv.config();

@Injectable()
export class AuthorizorService {
  deployed: any;
  jwt: Jwt;
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    @InjectRepository(Login, 'test')
    private loginRepository: Repository<Login>,

    @InjectRepository(application, 'DID')
    private applicationRepoitory: Repository<application>,

    @InjectRepository(connected, 'DID')
    private connectedRepository: Repository<connected>,

    @InjectRepository(user, 'DID')
    private userRepository: Repository<user>,
  ) {
    (async () => {
      this.deployed = await getDeployed();
      this.jwt = new Jwt();
    })();
  }

  async checkAPIKey(
    clientId: string,
    host: string,
    tokens: TokensDto,
    redirect_uri: string,
  ): Promise<false | CodeDto | TokensDto | number> {
    const registered = await this.applicationRepoitory.findOne({
      where: { APIKey: clientId, host, redirectURI: redirect_uri },
    });

    if (registered && clientId) {
      const result = await this.checkTokens(tokens);
      if (result) {
        return result;
      } else {
        return registered.idx;
      }
    } else {
      return false;
    }
  }

  async checkUser(
    { userId, userPw }: LoginDto,
    a_idx: string,
  ): Promise<false | LoginResultDto> {
    const secret = process.env.SALT;
    const hash = crypto
      .createHmac('sha256', secret)
      .update(userId + userPw)
      .digest('hex');

    const getUserInfoResult = await this.getUserInfoByHash(hash);

    if (getUserInfoResult) {
      const code = await this.createCodeAndSave(hash);

      const tokens = await this.createTokens(hash);

      const { DID_ACCESS_TOKEN: accessToken, DID_REFRESH_TOKEN: refreshToken } =
        tokens;

      await this.cacheManager.set(hash, accessToken, {
        ttl: 60 * 60 * 2,
      });

      await this.loginRepository.save({ hash, refreshToken });

      const userInfo = await this.userRepository.findOne({
        where: { userId },
        select: ['idx'],
      });

      const connectionCheck = await this.connectedRepository.findOne({
        where: {
          a_idx: Number(a_idx),
          u_idx: userInfo.idx,
        },
      });

      if (!connectionCheck) {
        console.log('check');
        await this.connectedRepository.save({
          a_idx: Number(a_idx),
          u_idx: userInfo.idx,
        });
      }

      return { code, accessToken, refreshToken };
    } else {
      return false;
    }
  }

  async createCodeAndSave(hash: string): Promise<string> {
    const code = v4().split('-').join('');
    await this.cacheManager.set(code, hash, { ttl: 60 });
    return code;
  }

  async getUserInfoByHash(hash: string): Promise<UserInfoDto | false> {
    try {
      const user = await this.deployed.methods
        .getUserInfo(hash)
        .call({ from: process.env.CONTRACT_DEPLOYER });
      return user;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async createTokens(hash: string): Promise<TokensDto> {
    const accessToken = await this.jwt.generateAccessToken({
      hash,
    });

    const refreshToken = this.jwt.generateRefreshToken();

    return { DID_ACCESS_TOKEN: accessToken, DID_REFRESH_TOKEN: refreshToken };
  }

  async getTokenByCode(codeDto: CodeDto): Promise<TokenDto | false> {
    const { code } = codeDto;

    const hash = (await this.cacheManager.get(code)) as string;
    const accessToken = (await this.cacheManager.get(hash)) as string;
    const getUserInfoResult = await this.getUserInfoByHash(hash);

    if (getUserInfoResult) {
      try {
        return { accessToken };
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  }

  async getTokenByHash(hash: string) {
    const accessToken = (await this.cacheManager.get(hash)) as string;

    await this.cacheManager.del(hash);

    const user = await this.deployed.methods
      .getUserInfo(hash)
      .call({ from: process.env.CONTRACT_DEPLOYER });

    if (user) {
      try {
        return { accessToken };
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  }

  async getHashByToken(accessToken: string): Promise<string> {
    const payload = await this.jwt.verifyToken(accessToken);
    const { hash } = payload;
    return hash;
  }

  async getUserInofByToken(accessToken: string): Promise<UserInfoDto | false> {
    const hash = await this.getHashByToken(accessToken);
    const getUserInfoResult = await this.getUserInfoByHash(hash);

    if (getUserInfoResult) {
      const userInfo: UserInfoDto = {
        name: getUserInfoResult.name,
        birth: getUserInfoResult.birth,
        gender: getUserInfoResult.gender,
        email: getUserInfoResult.email,
        userCode: getUserInfoResult.userCode,
      };
      return userInfo;
    } else {
      return false;
    }
  }

  async checkTokens(tokens: TokensDto): Promise<TokensDto | false | CodeDto> {
    const { DID_ACCESS_TOKEN, DID_REFRESH_TOKEN } = tokens;

    if (DID_ACCESS_TOKEN) {
      const hash = await this.getHashByToken(DID_ACCESS_TOKEN);
      const code = await this.createCodeAndSave(hash);

      return new CodeDto(code);
    } else if (DID_REFRESH_TOKEN) {
      const result = await this.loginRepository.findOne({
        where: { refreshToken: DID_REFRESH_TOKEN },
        select: ['hash'],
      });
      const { hash } = result;
      const getUserInfoResult = await this.getUserInfoByHash(hash);

      if (getUserInfoResult) {
        const code = await this.createCodeAndSave(hash);
        const tokens = await this.createTokens(hash);

        await this.loginRepository.update(
          { refreshToken: DID_REFRESH_TOKEN },
          {
            refreshToken: tokens.DID_REFRESH_TOKEN,
          },
        );

        return new TokensDto(
          code,
          tokens.DID_ACCESS_TOKEN,
          tokens.DID_REFRESH_TOKEN,
        );
      }
    } else {
      return false;
    }
  }
}
