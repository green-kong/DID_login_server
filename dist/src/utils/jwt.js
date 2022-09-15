"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const uuid_1 = require("uuid");
dotenv_1.default.config();
class Jwt {
    constructor() {
        this.secretKey = process.env.SECERET_KEY;
        this.algorithm = 'HS256';
        this.accessExpire = process.env.JWT_ACCESS_EXP;
        this.refreshExpire = process.env.JWT_REFRESH_EXP;
        this.issuer = process.env.JWT_ISSUER;
    }
    generateAccessToken(payload) {
        return new Promise((res, rej) => {
            const options = {
                algorithm: this.algorithm,
                expiresIn: this.accessExpire,
                issuer: this.issuer,
            };
            jsonwebtoken_1.default.sign(payload, this.secretKey, options, (err, token) => {
                if (err)
                    rej(err);
                res(token);
            });
        });
    }
    generateRefreshToken() {
        return (0, uuid_1.v4)().split('-').join('');
    }
    verifyToken(token) {
        return new Promise((res, rej) => {
            jsonwebtoken_1.default.verify(token, this.secretKey, (err, decoded) => {
                if (err)
                    rej(err);
                res(decoded);
            });
        });
    }
}
exports.Jwt = Jwt;
//# sourceMappingURL=jwt.js.map