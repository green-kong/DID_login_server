import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthorizorService } from './authorizor.service';
import { LoginDto } from './dto/login.dto';

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
    if (await this.authorizorService.checkAPIKey(clientID, host)) {
      res.render('index');
    } else {
      res.render('error');
    }
  }

  @Post('auth')
  async login(
    @Body() loginDto: LoginDto,
    @Query('redirectURI') redirectURI: string,
    @Res() res: Response,
  ) {
    const loginResult = await this.authorizorService.checkUser(loginDto);
    console.log(redirectURI);
    if (loginResult) {
      res.redirect(redirectURI);
    } else {
      res.render('index', { error: '아이디와 비밀번호를 다시 확인해 주세요.' });
    }
  }

  // @Get('token')
  // async getToken()
}
