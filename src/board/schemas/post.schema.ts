import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true })
  authorId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ enum: ['free', 'question'], default: 'free' }) // 자유/질문 게시판
  tag: 'free' | 'question';

  @Prop({ type: [String], default: [] })
  images: string[]; // 이미지 경로들

  @Prop({default: 0})
  likecount: number; // 좋아요 누른 유저 ID들

  @Prop({ type: Types.ObjectId, ref: 'User' })
  selectedCommentId?: Types.ObjectId; // 질문 채택 댓글
}

export const PostSchema = SchemaFactory.createForClass(Post);