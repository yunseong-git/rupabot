import { IsEmail, IsNotEmpty, MinLength, MaxLength ,Matches  } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email!: string;

  @IsNotEmpty({ message: '닉네임은 필수 입력 항목입니다.' })
  nickname!: string;

  @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
  /* 추후 사용예정
  @MinLength(10, { message: '비밀번호는 최소 10자리 이상이어야 합니다.' })
  @MaxLength(18, { message: '비밀번호는 18자리 미만이어야 합니다.' })
  @Matches(/^(?=.*[a-z])(?=.*\d)(?=.*[\W_])$/, {
    message: '비밀번호는 최소 하나의 소문자, 숫자, 특수문자를 포함해야 합니다.',
  })
  */
  password!: string;
}