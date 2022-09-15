import jsonwebtoken from 'jsonwebtoken';
import { PayloadDto } from 'src/authorizor/dto/payload.dto';
export declare class Jwt {
    algorithm: 'HS256';
    secretKey: string;
    accessExpire: string;
    refreshExpire: string;
    issuer: string;
    constructor();
    generateAccessToken(payload: PayloadDto): Promise<string>;
    generateRefreshToken(): string;
    verifyToken(token: string): Promise<jsonwebtoken.JwtPayload>;
}
