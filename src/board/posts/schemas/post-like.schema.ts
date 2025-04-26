import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostLikeDocument = PostLike & Document;

@Schema({ timestamps: true })
export class PostLike {
  @Prop({ required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, ref: 'Post' })
  postId: Types.ObjectId;
}

export const LikeSchema = SchemaFactory.createForClass(PostLike);
LikeSchema.index({ userId: 1, postId: 1 }, { unique: true }); // 중복 방지