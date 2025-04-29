import { IsString, Length } from 'class-validator';

export class UpdateNicknameDto {
  @IsString()
  @Length(2, 8) 
  newNickname: string;
}