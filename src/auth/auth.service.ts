//module
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

//reference
import { UsersService } from 'src/users/service/user-query.service';
import { RedisService } from 'src/redis/redis.service';

//dto
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User, UserDocument } from 'src/users/schemas/user.schema';

interface JwtPayload {
  sub: string;
  nickname: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * main api
   */
  async register(dto: RegisterDto): Promise<boolean> {
    await this.isExist(dto.email, dto.nickname); //중복확인
    const hashedPassword = await this.hashingPassword(dto.password); //비밀번호 암호화

    //userData 재가공
    const userData: CreateUserDto = {
      email: dto.email,
      nickname: dto.nickname,
      password: hashedPassword,
    };
    console.log(2);
    await this.usersService.create(userData); //유저 생성

    return true;
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.validateUser(dto.email, dto.password); //유저검증

    //jwt발급
    const payload: JwtPayload = { sub: user.id, nickname: user.nickname };
    const accessToken = await this.createAccessToken(payload);
    const refreshToken = await this.createRefreshToken(payload);

    await this.setRefreshToken(user.id, refreshToken); //refresh토큰 저장

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token이 존재하지 않습니다.');
    }

    console.log("service refreshToken",refreshToken);
    const payload = await this.verifyRefreshToken(refreshToken);
    console.log("service payload",payload);
    const newAccessToken = await this.createAccessToken(payload);

    
    console.log("service newAccessToken", newAccessToken);
    return { accessToken: newAccessToken };
  }

  async logout(refreshToken: string): Promise<boolean> {
    if (!refreshToken) return true;

    await this.deleteRefreshToken(refreshToken);

    return true;
  }

  /**
   * sub api
   */
  async isExist(email: string, nickname: string): Promise<void> {
    const isExistEmail = await this.usersService.findByEmail(email);
    if (isExistEmail) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }
    const isExistNickName = await this.usersService.findByNickname(nickname);
    if (isExistNickName) {
      throw new ConflictException('이미 존재하는 닉네임입니다.');
    }
  }

  async hashingPassword(password: string): Promise<string> {
    const salt = this.configService.get<number>('BCRYPT_SALT', { infer: true });
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  private async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 이메일입니다.');
    }
    console.log(user);
    await this.validatePassword(password, user.password);

    return user;
  }

  private async validatePassword(password: string, hashedPassword: string): Promise<void> {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('입력정보가 일치하지 않습니다.');
    }
  }

  async createRefreshToken(payload: JwtPayload): Promise<string> {
    const { exp, ...cleanedPayload } = payload as any;
    
    return this.jwtService.signAsync(cleanedPayload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });
  }

  async createAccessToken(payload: JwtPayload): Promise<string> {
    const { exp, ...cleanedPayload } = payload as any;
   
    return this.jwtService.signAsync(cleanedPayload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '1m',
    });
  }

  async setRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.redisService.set(
      `refresh:${userId}`,
      refreshToken,
      60 * 60 * 24 * 7, //TTL = 7d
    );
  }

  async verifyRefreshToken(refreshToken: string): Promise<JwtPayload> {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });
    const stored = await this.redisService.get(`refresh:${payload.sub}`);

    if (!stored || stored !== refreshToken) {
      throw new UnauthorizedException('Refresh token이 유효하지 않습니다.');
    }
    return payload;
  }

  async deleteRefreshToken(refreshToken: string): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      await this.redisService.del(`refresh:${payload.sub}`);
    } catch (err) {}

    return true;
  }
}
