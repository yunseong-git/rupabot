import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
//dto
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } = await this.AuthService.login(dto);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // JS에서 접근 못함 → XSS 방지
      secure: true, // HTTPS에서만 전송 (개발 시 false로 테스트 가능)
      sameSite: 'strict', // CSRF 방지
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7일
    });

    return { accessToken };
  }

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto): Promise<boolean> {
    console.log(1);
    return this.AuthService.register(dto);
  }

  @Public()
  @Post('refresh')
  async refresh(@Req() req: Request): Promise<{ accessToken: string }> {
    const refreshToken = req.cookies?.refreshToken;
    console.log("controller refreshToken",refreshToken)
    const accessToken = await this.AuthService.refresh(refreshToken);
    console.log("controller AccessToken", accessToken);
    return accessToken;
  }

  @Public()
  @Post('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<boolean> {
    const token = req.cookies?.refreshToken;
    console.log(token);
    res.clearCookie('refreshToken');
    return this.AuthService.logout(token);
  }

  @Get('me')
  getMe(@Req() req: Request) {
    return req.user;
  }
}
