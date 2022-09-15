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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizorModule = exports.cacheModule = void 0;
const common_1 = require("@nestjs/common");
const redisStore = __importStar(require("cache-manager-redis-store"));
const authorizor_controller_1 = require("./authorizor.controller");
const authorizor_service_1 = require("./authorizor.service");
const typeorm_1 = require("@nestjs/typeorm");
const login_entity_1 = require("./entities/login.entity");
const application_entity_1 = require("./entities/application.entity");
const connected_entity_1 = require("./entities/connected.entity");
const user_entity_1 = require("./entities/user.entity");
exports.cacheModule = common_1.CacheModule.registerAsync({
    useFactory: async () => ({
        store: redisStore,
        host: 'localhost',
        port: '6379',
        ttl: 0,
    }),
});
let AuthorizorModule = class AuthorizorModule {
};
AuthorizorModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([login_entity_1.Login], 'test'),
            typeorm_1.TypeOrmModule.forFeature([application_entity_1.application, connected_entity_1.connected, user_entity_1.user], 'DID'),
            exports.cacheModule,
        ],
        providers: [authorizor_service_1.AuthorizorService],
        controllers: [authorizor_controller_1.AuthorizorController],
    })
], AuthorizorModule);
exports.AuthorizorModule = AuthorizorModule;
//# sourceMappingURL=authorizor.module.js.map