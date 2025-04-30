import { Exclude, Expose } from 'class-transformer';

@Exclude() // 모든 필드 기본 제외
export class ManyUsersResponseDto {
  @Expose()
  _id: string;

  @Expose()
  email: string;

  @Expose()
  nickname: string;

  @Expose()
  rupa: number;

  @Expose()
  rank: string;

  @Expose()
  attendcount: number;

  @Expose()
  bancount: number;
}

@Exclude()
export class SingleUserResponseDto extends ManyUsersResponseDto{
 @Expose()
  lastAttendance: Date;

  @Expose()
  nicknameUpdatedAt: Date;

  @Expose()
  image: string;
}

@Exclude()
export class UserToUserResponseDto {
  @Expose()
  nickname: string;

  @Expose()
  rank: string;

  @Expose()
  attendcount: number;

  @Expose()
  nicknameUpdatedAt: Date;

  @Expose()
  bancount: number;

  @Expose()
  image: string;
}
