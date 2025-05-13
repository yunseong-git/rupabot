import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiTags, ApiBody, ApiResponse, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';
//dto
import { JwtPayload, SuccessResponseDto, TokenResponseDto, UserInfoResponseDto } from './dto/auth-response.dto';
import { LoginDto, RegisterDto } from './dto/auth-request.dto';

@ApiTags('Auth') // 그룹 이름
@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) { }

  @Public()
  @Post('login')
  @ApiOperation({ summary: '로그인' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'accessToken은 본문으로, refreshToken은 HttpOnly 쿠키로 전송', type: TokenResponseDto })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response): Promise<TokenResponseDto> {
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
  @Post('refresh')
  @ApiOperation({ summary: 'Access Token 재발급' })
  @ApiCookieAuth() // Swagger에 "쿠키 필요" 표시
  @ApiResponse({
    status: 200,
    description: 'refreshToken 쿠키를 통해 accessToken 재발급',
    type: TokenResponseDto,
  })
  async refresh(@Req() req: Request): Promise<TokenResponseDto> {
    const refreshToken = req.cookies?.refreshToken;
    console.log("controller refreshToken", refreshToken)
    const accessToken = await this.AuthService.refresh(refreshToken);
    console.log("controller AccessToken", accessToken);
    return accessToken;
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: '회원가입' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: '회원가입 성공 여부 (true/false)', type: Boolean })
  async register(@Body() dto: RegisterDto): Promise<boolean> {
    return this.AuthService.register(dto);
  }


  @Public()
  @Post('logout')
  @ApiOperation({ summary: '로그아웃 (refreshToken 쿠키 삭제)' })
  @ApiCookieAuth()
  @ApiResponse({ status: 200, description: '로그아웃 성공 여부', type: SuccessResponseDto })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<SuccessResponseDto> {
    const token = req.cookies?.refreshToken;
    console.log(token);
    res.clearCookie('refreshToken');
    
    return await this.AuthService.logout(token);
  }

  @Get('me')
  @ApiOperation({ summary: '현재 로그인된 사용자 정보 조회' })
  @ApiResponse({ status: 200, description: '로그인한 유저 정보', type: UserInfoResponseDto, })
  getMe(@Req() req: Request): UserInfoResponseDto {
    const user = req.user as JwtPayload;
    if (!user) throw new UnauthorizedException('로그인 유저 정보가 없습니다.');
    return {
      userId: user.userId,
      nickname: user.nickname,
    }
  }
}
