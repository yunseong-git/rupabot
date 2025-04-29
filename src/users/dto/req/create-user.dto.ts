import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  nickname!: string;

  @IsNotEmpty()
  password!: string;

//아이템목록과 루파는 그냥 0
}