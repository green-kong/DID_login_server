import { Request, Response } from 'express';
import { AuthorizorService } from './authorizor.service';
import { LoginDto } from './dto/login.dto';
import { CodeDto } from './dto/code.dto';
export declare class AuthorizorController {
    private readonly authorizorService;
    constructor(authorizorService: AuthorizorService);
    renderLoginPage(redirect_uri: string, clientID: string, res: Response, req: Request): Promise<void>;
    login(loginDto: LoginDto, redirectURI: string, req: Request, res: Response): Promise<void>;
    createToken(codeDto: CodeDto, res: Response): Promise<void>;
    getUserInfo(bearerToken: string, res: Response): Promise<void>;
}
