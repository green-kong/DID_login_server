"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto = __importStar(require("crypto"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const login_entity_1 = require("./entities/login.entity");
const code_dto_1 = require("./dto/code.dto");
const connectDeployed_1 = require("../utils/connectDeployed");
const jwt_1 = require("../utils/jwt");
const tokens_dto_1 = require("./dto/tokens.dto");
const application_entity_1 = require("./entities/application.entity");
const connected_entity_1 = require("./entities/connected.entity");
const user_entity_1 = require("./entities/user.entity");
dotenv_1.default.config();
let AuthorizorService = class AuthorizorService {
    constructor(cacheManager, loginRepository, applicationRepoitory, connectedRepository, userRepository) {
        this.cacheManager = cacheManager;
        this.loginRepository = loginRepository;
        this.applicationRepoitory = applicationRepoitory;
        this.connectedRepository = connectedRepository;
        this.userRepository = userRepository;
        (async () => {
            this.deployed = await (0, connectDeployed_1.getDeployed)();
            this.jwt = new jwt_1.Jwt();
        })();
    }
    async checkAPIKey(clientId, host, tokens, redirect_uri) {
        const registered = await this.applicationRepoitory.findOne({
            where: { APIKey: clientId, host, redirectURI: redirect_uri },
        });
        if (registered && clientId) {
            const result = await this.checkTokens(tokens);
            if (result) {
                return result;
            }
            else {
                return registered.idx;
            }
        }
        else {
            return false;
        }
    }
    async checkUser({ userId, userPw }, a_idx) {
        const secret = process.env.SALT;
        const hash = crypto
            .createHmac('sha256', secret)
            .update(userId + userPw)
            .digest('hex');
        const getUserInfoResult = await this.getUserInfoByHash(hash);
        if (getUserInfoResult) {
            const code = await this.createCodeAndSave(hash);
            const tokens = await this.createTokens(hash);
            const { DID_ACCESS_TOKEN: accessToken, DID_REFRESH_TOKEN: refreshToken } = tokens;
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
        }
        else {
            return false;
        }
    }
    async createCodeAndSave(hash) {
        const code = (0, uuid_1.v4)().split('-').join('');
        await this.cacheManager.set(code, hash, { ttl: 60 });
        return code;
    }
    async getUserInfoByHash(hash) {
        try {
            const user = await this.deployed.methods
                .getUserInfo(hash)
                .call({ from: process.env.CONTRACT_DEPLOYER });
            return user;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    async createTokens(hash) {
        const accessToken = await this.jwt.generateAccessToken({
            hash,
        });
        const refreshToken = this.jwt.generateRefreshToken();
        return { DID_ACCESS_TOKEN: accessToken, DID_REFRESH_TOKEN: refreshToken };
    }
    async getTokenByCode(codeDto) {
        const { code } = codeDto;
        const hash = (await this.cacheManager.get(code));
        const accessToken = (await this.cacheManager.get(hash));
        const getUserInfoResult = await this.getUserInfoByHash(hash);
        if (getUserInfoResult) {
            try {
                return { accessToken };
            }
            catch (error) {
                console.log(error);
                return false;
            }
        }
    }
    async getTokenByHash(hash) {
        const accessToken = (await this.cacheManager.get(hash));
        await this.cacheManager.del(hash);
        const user = await this.deployed.methods
            .getUserInfo(hash)
            .call({ from: process.env.CONTRACT_DEPLOYER });
        if (user) {
            try {
                return { accessToken };
            }
            catch (error) {
                console.log(error);
                return false;
            }
        }
    }
    async getHashByToken(accessToken) {
        const payload = await this.jwt.verifyToken(accessToken);
        const { hash } = payload;
        return hash;
    }
    async getUserInofByToken(accessToken) {
        const hash = await this.getHashByToken(accessToken);
        const getUserInfoResult = await this.getUserInfoByHash(hash);
        if (getUserInfoResult) {
            const userInfo = {
                name: getUserInfoResult.name,
                birth: getUserInfoResult.birth,
                gender: getUserInfoResult.gender,
                email: getUserInfoResult.email,
                userCode: getUserInfoResult.userCode,
            };
            return userInfo;
        }
        else {
            return false;
        }
    }
    async checkTokens(tokens) {
        const { DID_ACCESS_TOKEN, DID_REFRESH_TOKEN } = tokens;
        if (DID_ACCESS_TOKEN) {
            const hash = await this.getHashByToken(DID_ACCESS_TOKEN);
            console.log(hash);
            const code = await this.createCodeAndSave(hash);
            return new code_dto_1.CodeDto(code);
        }
        else if (DID_REFRESH_TOKEN) {
            const result = await this.loginRepository.findOne({
                where: { refreshToken: DID_REFRESH_TOKEN },
                select: ['hash'],
            });
            const { hash } = result;
            const getUserInfoResult = await this.getUserInfoByHash(hash);
            if (getUserInfoResult) {
                const code = await this.createCodeAndSave(hash);
                const tokens = await this.createTokens(hash);
                await this.loginRepository.update({ refreshToken: DID_REFRESH_TOKEN }, {
                    refreshToken: tokens.DID_REFRESH_TOKEN,
                });
                return new tokens_dto_1.TokensDto(code, tokens.DID_ACCESS_TOKEN, tokens.DID_REFRESH_TOKEN);
            }
        }
        else {
            return false;
        }
    }
};
AuthorizorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(common_1.CACHE_MANAGER)),
    __param(1, (0, typeorm_1.InjectRepository)(login_entity_1.Login, 'test')),
    __param(2, (0, typeorm_1.InjectRepository)(application_entity_1.application, 'DID')),
    __param(3, (0, typeorm_1.InjectRepository)(connected_entity_1.connected, 'DID')),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.user, 'DID')),
    __metadata("design:paramtypes", [Object, typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AuthorizorService);
exports.AuthorizorService = AuthorizorService;
//# sourceMappingURL=authorizor.service.js.map