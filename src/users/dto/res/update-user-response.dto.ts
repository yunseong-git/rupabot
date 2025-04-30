export class UpdateUserNicknameResponseDto {
  updatedAt: Date;
  nickname: string;
  newNickname: string;
}

export class UserBanResponseDto {
  nickname: string;
  bancount: number;
  updatecount: number;
}

export class UserRankUpResponseDto {
  updatedAt: Date;
  nickname: string;
  newRank: string;
}
