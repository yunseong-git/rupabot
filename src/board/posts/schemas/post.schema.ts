import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Query } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true, ref: 'User' })
  authorId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ enum: ['free', 'cs'], default: 'free' })
  type: 'free' | 'cs'; //게시판 종류

  @Prop({ type: [String], default: [] })
  tag: string[]; // 태그 ex) #nest, #mongoDB

  @Prop({ type: [String], default: [] })
  images: string[]; // 이미지 경로들

  @Prop({ default: 0 })
  likecount: number;

  @Prop({ default: 0 })
  viewcount: number;

  @Prop({ default: 0 })
  isDeleted: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Comment' })
  bestComment?: Types.ObjectId;
}

export const PostSchema = SchemaFactory.createForClass(Post);
