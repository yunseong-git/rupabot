import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Query } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true, ref: 'Post' })
  postId: Types.ObjectId;

  @Prop({ required: true, ref: 'User' })
  authorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
  pId: Types.ObjectId | null;

  @Prop({ required: true })
  content: string;

  @Prop({ default: 0 })
  likecount: number;

  @Prop({ default: false })
  isUpdated: boolean;

  @Prop({ default: false, select: false })
  isDeleted: boolean;

  @Prop({ default: null, enum: [null, '작성자', '관리자', '게시물'] })
  deletedBy: string;

  @Prop({ default: null })
  deletedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);