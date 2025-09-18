import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, SuccessResponseDto } from './dto/auth-response.dto';

//service
import { UserQueryService } from 'src/users/service/user-query.service';
import { UserCommandService } from 'src/users/service/user-command.service';
import { RedisService } from 'src/redis/redis.service';

//dto
import { LoginDto, RegisterDto } from './dto/auth-request.dto';
import { CreateUserDto } from 'src/users/dto/req/create-user.dto';
import { UserDocument } from 'src/users/schemas/user.schema';


@Injectable()
export class AuthService {
  constructor(
    private readonly userQueryService: UserQueryService,
    private readonly userCommandService: UserCommandService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) { }


  /**회원가입*/
  async register(dto: RegisterDto): Promise<boolean> {
    await this.userQueryService.isExist(dto.email, dto.nickname); //중복확인
    const hashedPassword = await this.hashingPassword(dto.password); //비밀번호 암호화

    //userData 재가공
    const userData: CreateUserDto = {
      email: dto.email,
      nickname: dto.nickname,
      password: hashedPassword,
    };
    await this.userCommandService.createUser(userData); //유저 생성

    return true;
  }

  /**로그인*/
  async login(dto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.validateUser(dto.email, dto.password); //유저검증

    //jwt발급
    const payload: JwtPayload = { userId: user.id, nickname: user.nickname };
    const accessToken = await this.createAccessToken(payload);
    const refreshToken = await this.createRefreshToken(payload);

    await this.setRefreshToken(user.id, refreshToken); //refresh토큰 저장

    return {
      accessToken,
      refreshToken,
    };
  }

  /**refreshToken으로 accessToken 재발급*/
  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh Token이 존재하지 않습니다.');
    }

    try {
      const payload = await this.verifyRefreshToken(refreshToken);
      const newAccessToken = await this.createAccessToken(payload);
      return { accessToken: newAccessToken };
    } catch (err) {
      console.error('[AuthService] refresh 에러:', err?.message || err);
      throw new UnauthorizedException('Refresh Token이 유효하지 않습니다.');
    }
  }

  /**로그아웃*/
  async logout(refreshToken: string): Promise<SuccessResponseDto> {
    if (!refreshToken) return { success: true };

    await this.deleteRefreshToken(refreshToken);

    return { success: true };
  }

  /**비밀번호 해싱*/
  private async hashingPassword(password: string): Promise<string> {
    const salt = this.configService.get<number>('BCRYPT_SALT', { infer: true });
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  /**유저 email,password DB와 비교*/
  private async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.userQueryService.findPassword(email);

    if (!user) {
      throw new UnauthorizedException('존재하지 않는 이메일입니다.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    return user;
  }

  /**RefreshToken발급*/
  private async createRefreshToken(payload: JwtPayload): Promise<string> {
    const { exp, ...cleanedPayload } = payload as any;

    return this.jwtService.signAsync(cleanedPayload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
  }

  /**AccessToken발급*/
  private async createAccessToken(payload: JwtPayload): Promise<string> {
    const { exp, ...cleanedPayload } = payload as any;

    return this.jwtService.signAsync(cleanedPayload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '1h',
    });
  }

  /**redis 서버에 refreshToken저장*/
  private async setRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.redisService.set(
      `refresh:${userId}`,
      refreshToken,
      60 * 60 * 24 * 7, //TTL = 7d
    );
  }
  /**유저와 redis간의 RefreshToken검증*/
  private async verifyRefreshToken(refreshToken: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const stored = await this.redisService.get(`refresh:${payload.userId}`);
      if (!stored || stored !== refreshToken) {
        throw new UnauthorizedException('Refresh Token이 일치하지 않습니다.');
      }

      return payload;
    } catch (err) {
      console.error('[AuthService] verifyRefreshToken 실패:', err?.message || err);
      throw new UnauthorizedException('Refresh Token이 유효하지 않습니다.');
    }
  }

  /**redis 서버 refreshToken삭제*/
  private async deleteRefreshToken(refreshToken: string): Promise<void> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      await this.redisService.del(`refresh:${payload.userId}`);
    } catch (err) {
      console.warn('[AuthService] deleteRefreshToken 실패:', err?.message || err);
    }
  }
}
