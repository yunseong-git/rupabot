import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CommentLikeDocument = CommentLike & Document;

@Schema({ timestamps: true })
export class CommentLike {
    @Prop({ required: true, ref: 'User' })
    userId: Types.ObjectId;

    @Prop({ required: true, ref: 'Comment' })
    commentId: Types.ObjectId;
}

export const LikeSchema = SchemaFactory.createForClass(CommentLike);
LikeSchema.index({ userId: 1, CommentId: 1 }, { unique: true }); // 중복 방지