import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

interface JwtPayload {
    sub: string;
    email: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) { }


    async register(dto: RegisterDto) {
        const isExist = await this.usersService.findByEmail(dto.email);
        if(isExist){
            throw new UnauthorizedException('이미 존재하는 이메일입니다.');
        }
        const salt = this.configService.get<number>('BCRYPT_SALT', { infer: true });
        const hash = await bcrypt.hash(dto.password, salt);
        const user = await this.usersService.create({
            ...dto,
            password: hash,
        });
        return user;
    }

    async login(dto: LoginDto) {
        const { email, password } = dto;
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('존재하지 않는 이메일입니다.');
        }
        await this.validatePassword(password, user.password);
        const payload: JwtPayload = { sub: user.id, email: user.email };
        const accessToken = this.jwtService.sign(payload);
        return { accessToken, user: { id: user._id, nickname: user.nickname }, };
    }

    private async validatePassword(password: string, hashedPassword: string) {
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);
        if (!isPasswordValid) {
            throw new UnauthorizedException('입력정보가 일치하지 않습니다.');
        }
    }
}
