import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, unique: true })
  nickname: string;

  @Prop() //이미지 주소
  image: string;

  @Prop({ default: 0 })
  rupa: number;

  @Prop({
    required: true,
    enum: ['응애루파', '루파', '골드루파', '에매루파', '다이아루파', '루비루파', '루파킹'],
    default: '응애루파',
  })
  rank: string;

  @Prop({ default: null })
  lastAttendance: Date; // 가장 최근 출석일 (출석 중복 방지용)

  @Prop({ default: 0 })
  attendcount: number;

  @Prop({ type: Date, default: null })
  nicknameUpdatedAt: Date;

  @Prop({ default: 0 })
  bancount: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Emoji' }], default: [] })
  emojis: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
