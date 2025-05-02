export class UpdateNicknameResponseDto {
  updatedAt: Date;
  nickname: string;
  newNickname: string;
}

export class BanUserResponseDto {
  nickname: string;
  bancount: number;
  updatecount: number;
}

export class UpdateRankResponseDto {
  updatedAt: Date;
  nickname: string;
  newRank: string;
}
