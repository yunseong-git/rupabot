import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmojiDocument = Emoji & Document;

@Schema({ timestamps: true })
export class Emoji {
  @Prop({ required: true, unique: true })
  name: string; // 하이루파, 히잉루파 등

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  image: string; // 이미지 경로 또는 파일명
}

export const EmojiSchema = SchemaFactory.createForClass(Emoji);