"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const login_entity_1 = require("./authorizor/entities/login.entity");
const authorizor_module_1 = require("./authorizor/authorizor.module");
const application_entity_1 = require("./authorizor/entities/application.entity");
const connected_entity_1 = require("./authorizor/entities/connected.entity");
const user_entity_1 = require("./authorizor/entities/user.entity");
const db_config_1 = __importDefault(require("../db.config"));
dotenv_1.default.config();
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                name: 'test',
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: db_config_1.default.login.user,
                password: db_config_1.default.login.password,
                database: db_config_1.default.login.database,
                entities: [login_entity_1.Login],
                synchronize: false,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                name: 'DID',
                type: 'mysql',
                host: db_config_1.default.main.host,
                port: 3306,
                username: db_config_1.default.main.user,
                password: db_config_1.default.main.password,
                database: db_config_1.default.main.database,
                entities: [application_entity_1.application, connected_entity_1.connected, user_entity_1.user],
                synchronize: false,
            }),
            authorizor_module_1.AuthorizorModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map