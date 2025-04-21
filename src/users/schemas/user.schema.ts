import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, unique: true })
    nickname: string;

    @Prop({ default: 0 })
    lupa: number;

    @Prop({ default: null })
    lastAttendance: Date; // 가장 최근 출석일 (출석 중복 방지용)

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Item' }], default: [] })
    items: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);