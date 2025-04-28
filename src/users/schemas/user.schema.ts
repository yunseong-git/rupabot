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
  lupa: number;

  @Prop({ required: true, default: '응애루파' })
  rank: string;

  @Prop({ default: null })
  lastAttendance: Date; // 가장 최근 출석일 (출석 중복 방지용)

  @Prop({ default: 0 })
  attendcount: number;

  @Prop({ type: Date, default: null })
  nicknameUpdatedAt: Date;

  @Prop({ default: 0 })
  bannedcount: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Item' }], default: [] })
  items: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
