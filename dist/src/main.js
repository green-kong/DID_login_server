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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
const cors_1 = __importDefault(require("cors"));
const nunjucks = __importStar(require("nunjucks"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const express = app.getHttpAdapter().getInstance();
    const views = process.env.NODE_ENV
        ? (0, path_1.join)(__dirname, '..', '..', 'views')
        : (0, path_1.join)(__dirname, '..', 'views');
    const staticPath = process.env.NODE_ENV
        ? (0, path_1.join)(__dirname, '..', '..', 'assets')
        : (0, path_1.join)(__dirname, '..', 'assets');
    app.use((0, cors_1.default)({ origin: true, credential: true }));
    app.use((0, cookie_parser_1.default)());
    app.useStaticAssets(staticPath);
    app.setBaseViewsDir(views);
    nunjucks.configure(views, { express });
    app.setViewEngine('html');
    await app.listen(8000);
}
bootstrap();
//# sourceMappingURL=main.js.map