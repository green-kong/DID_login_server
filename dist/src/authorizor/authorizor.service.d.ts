import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { Login } from './entities/login.entity';
import { LoginDto } from './dto/login.dto';
import { CodeDto } from './dto/code.dto';
import { Jwt } from '../utils/jwt';
import { TokenDto } from './dto/token.dto';
import { LoginResultDto } from './dto/loginResult.dto';
import { UserInfoDto } from './dto/user.dto';
import { TokensDto } from './dto/tokens.dto';
import { application } from './entities/application.entity';
import { connected } from './entities/connected.entity';
import { user } from './entities/user.entity';
export declare class AuthorizorService {
    private readonly cacheManager;
    private loginRepository;
    private applicationRepoitory;
    private connectedRepository;
    private userRepository;
    deployed: any;
    jwt: Jwt;
    constructor(cacheManager: Cache, loginRepository: Repository<Login>, applicationRepoitory: Repository<application>, connectedRepository: Repository<connected>, userRepository: Repository<user>);
    checkAPIKey(clientId: string, host: string, tokens: TokensDto, redirect_uri: string): Promise<false | CodeDto | TokensDto | number>;
    checkUser({ userId, userPw }: LoginDto, a_idx: string): Promise<false | LoginResultDto>;
    createCodeAndSave(hash: string): Promise<string>;
    getUserInfoByHash(hash: string): Promise<UserInfoDto | false>;
    createTokens(hash: string): Promise<TokensDto>;
    getTokenByCode(codeDto: CodeDto): Promise<TokenDto | false>;
    getTokenByHash(hash: string): Promise<false | {
        accessToken: string;
    }>;
    getHashByToken(accessToken: string): Promise<string>;
    getUserInofByToken(accessToken: string, clientID: string): Promise<UserInfoDto | false>;
    checkTokens(tokens: TokensDto): Promise<TokensDto | false | CodeDto>;
}
