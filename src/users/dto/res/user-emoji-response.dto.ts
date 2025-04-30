export class OwnedEmojiResponseDto {
    _id : string;
    emojis: string[]; // 이미지 URL 배열
}

  /* 추후 transaction으로 이동
  async findById(userId: string, session: ClientSession | null = null) {
    return this.userModel.findById(userId).session(session);
  }
    */

    /* 추후 트랜잭션으로 이동
  async addItem(userId: string, itemId: string, price: number, session?: ClientSession) {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        $inc: { lupa: -price },
        $push: { items: itemId },
      },
      { new: true, session },
    );
  }
    */