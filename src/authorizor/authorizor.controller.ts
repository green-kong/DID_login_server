import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthorizorService } from './authorizor.service';
import { LoginDto } from './dto/login.dto';
import { CodeDto } from './dto/code.dto';
import { TokensDto } from './dto/tokens.dto';

@Controller('authorizor')
export class AuthorizorController {
  constructor(private readonly authorizorService: AuthorizorService) {}

  @Get('auth')
  async renderLoginPage(
    @Query('redirectURI') redirect_uri: string,
    @Query('clientID') clientID: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const { referer: host } = req.headers;
    const { DID_ACCESS_TOKEN, DID_REFRESH_TOKEN } = req.cookies;
    const tokens = { DID_ACCESS_TOKEN, DID_REFRESH_TOKEN };

    const checkAPIKeyResult = await this.authorizorService.checkAPIKey(
      clientID,
      host,
      tokens,
      redirect_uri,
    );

    if (typeof checkAPIKeyResult === 'number') {
      res.cookie('a_idx', checkAPIKeyResult);
      res.render('index');
      return;
    } else if (checkAPIKeyResult === false) {
      res.render('error');
      return;
    } else if (checkAPIKeyResult instanceof CodeDto) {
      console.log('Access_Token 으로 로그인');
      res.redirect(redirect_uri + `?code=${checkAPIKeyResult.code}`);
      return;
    } else if (checkAPIKeyResult instanceof TokensDto) {
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

  @Post('auth')
  async login(
    @Body() loginDto: LoginDto,
    @Query('redirectURI') redirectURI: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
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
    } else {
      res.render('index', { error: '아이디와 비밀번호를 다시 확인해 주세요.' });
    }
  }

  @Post('token')
  async createToken(@Body() codeDto: CodeDto, @Res() res: Response) {
    const result = await this.authorizorService.getTokenByCode(codeDto);

    if (result) {
      res.send(result.accessToken);
    } else {
      res.status(500).send('token Error');
    }
  }

  @Get('user')
  async getUserInfo(
    @Headers('authorization') bearerToken: string,
    @Res() res: Response,
  ) {
    const accessToken = bearerToken.split(' ')[1];
    const userInfo = await this.authorizorService.getUserInofByToken(
      accessToken,
    );
    if (userInfo) {
      res.send(userInfo);
    } else {
      res.status(500).send('token Error');
    }
  }
}
