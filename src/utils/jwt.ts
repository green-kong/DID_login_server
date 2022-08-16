import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';
import { v4 } from 'uuid';
import { PayloadDto } from 'src/authorizor/dto/payload.dto';

dotenv.config();

export class Jwt {
  algorithm: 'HS256';
  secretKey: string;
  accessExpire: string;
  refreshExpire: string;
  issuer: string;

  constructor() {
    this.secretKey = process.env.SECERET_KEY;
    this.algorithm = 'HS256';
    this.accessExpire = process.env.JWT_ACCESS_EXP;
    this.refreshExpire = process.env.JWT_REFRESH_EXP;
    this.issuer = process.env.JWT_ISSUER;
  }

  generateAccessToken(payload: PayloadDto): Promise<string> {
    return new Promise((res, rej) => {
      const options = {
        algorithm: this.algorithm,
        expiresIn: this.accessExpire,
        issuer: this.issuer,
      };
      jsonwebtoken.sign(payload, this.secretKey, options, (err, token) => {
        if (err) rej(err);
        res(token);
      });
    });
  }

  generateRefreshToken(): string {
    return v4().split('-').join('');
  }

  verifyToken(token: string): Promise<jsonwebtoken.JwtPayload> {
    return new Promise((res, rej) => {
      jsonwebtoken.verify(token, this.secretKey, (err, decoded) => {
        if (err) rej(err);
        res(decoded as jsonwebtoken.JwtPayload);
      });
    });
  }
}
