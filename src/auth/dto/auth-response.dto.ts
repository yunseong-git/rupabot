import { ApiProperty } from "@nestjs/swagger";

export type JwtPayload = {
    userId: string;
    nickname: string;
}

export class TokenResponseDto {
    @ApiProperty({ example: 'jwt.access.token.here' })
    accessToken: string;
}

export class UserInfoResponseDto {
    @ApiProperty({ example: '660fa04149ac491601f005b6' })
    userId: string;

    @ApiProperty({ example: '루파유저' })
    nickname: string;
}

export class SuccessResponseDto {
    @ApiProperty({ example: true })
    success: boolean;
}