"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizorController = void 0;
const common_1 = require("@nestjs/common");
const authorizor_service_1 = require("./authorizor.service");
const login_dto_1 = require("./dto/login.dto");
const code_dto_1 = require("./dto/code.dto");
const tokens_dto_1 = require("./dto/tokens.dto");
let AuthorizorController = class AuthorizorController {
    constructor(authorizorService) {
        this.authorizorService = authorizorService;
    }
    async renderLoginPage(redirect_uri, clientID, res, req) {
        const { referer: host } = req.headers;
        const { DID_ACCESS_TOKEN, DID_REFRESH_TOKEN } = req.cookies;
        const tokens = { DID_ACCESS_TOKEN, DID_REFRESH_TOKEN };
        const checkAPIKeyResult = await this.authorizorService.checkAPIKey(clientID, host, tokens, redirect_uri);
        if (typeof checkAPIKeyResult === 'number') {
            res.cookie('a_idx', checkAPIKeyResult);
            res.render('index');
            return;
        }
        else if (checkAPIKeyResult === false) {
            res.render('error');
            return;
        }
        else if (checkAPIKeyResult instanceof code_dto_1.CodeDto) {
            console.log('Access_Token 으로 로그인');
            res.redirect(redirect_uri + `?code=${checkAPIKeyResult.code}`);
            return;
        }
        else if (checkAPIKeyResult instanceof tokens_dto_1.TokensDto) {
            res.cookie('DID_ACCESS_TOKEN', checkAPIKeyResult.DID_ACCESS_TOKEN, {
                maxAge: 1000 * 60 * 60 * 2 - 10000,
            });
            res.cookie('DID_REFRESH_TOKEN', checkAPIKeyResult.DID_REFRESH_TOKEN, {
                maxAge: 1000 * 60 * 60 * 24 * 7 * 2 - 10000,
            });
            console.log('refresh로 로그인!');
            res.redirect(redirect_uri + `?code=${checkAPIKeyResult.code}`);
        }
    }
    async login(loginDto, redirectURI, req, res) {
        const { a_idx } = req.cookies;
        const loginResult = await this.authorizorService.checkUser(loginDto, a_idx);
        if (loginResult) {
            res.cookie('DID_ACCESS_TOKEN', loginResult.accessToken, {
                httpOnly: true,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 2),
            });
            res.cookie('DID_REFRESH_TOKEN', loginResult.refreshToken, {
                httpOnly: true,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
            });
            res.cookie('a_idx', '', { maxAge: 0 });
            res.redirect(redirectURI + `?code=${loginResult.code}`);
        }
        else {
            res.render('index', { error: '아이디와 비밀번호를 다시 확인해 주세요.' });
        }
    }
    async createToken(codeDto, res) {
        const result = await this.authorizorService.getTokenByCode(codeDto);
        if (result) {
            res.send(result.accessToken);
        }
        else {
            res.clearCookie('DID_ACCESS_TOKEN');
            res.clearCookie('DID_REFRESH_TOKEN');
            res.status(500).send('token Error');
        }
    }
    async getUserInfo(bearerToken, res) {
        const accessToken = bearerToken.split(' ')[1];
        const userInfo = await this.authorizorService.getUserInofByToken(accessToken);
        if (userInfo) {
            res.send(userInfo);
        }
        else {
            res.status(500).send('token Error');
        }
    }
};
__decorate([
    (0, common_1.Get)('auth'),
    __param(0, (0, common_1.Query)('redirectURI')),
    __param(1, (0, common_1.Query)('clientID')),
    __param(2, (0, common_1.Res)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthorizorController.prototype, "renderLoginPage", null);
__decorate([
    (0, common_1.Post)('auth'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('redirectURI')),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthorizorController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('token'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [code_dto_1.CodeDto, Object]),
    __metadata("design:returntype", Promise)
], AuthorizorController.prototype, "createToken", null);
__decorate([
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthorizorController.prototype, "getUserInfo", null);
AuthorizorController = __decorate([
    (0, common_1.Controller)('authorizor'),
    __metadata("design:paramtypes", [authorizor_service_1.AuthorizorService])
], AuthorizorController);
exports.AuthorizorController = AuthorizorController;
//# sourceMappingURL=authorizor.controller.js.map