import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RecordDocument = Record & Document;

export enum RecordType {
    Attendance = '출석',
    Battle = '배틀',
    Purchase = '구매',
}

@Schema({ timestamps: true })
export class Record {
    @Prop({ required: true, ref: 'User' })
    userId: Types.ObjectId;

    @Prop({ required: true, enum: RecordType })
    type: RecordType;

    @Prop()
    content: string;

    @Prop({ required: true })
    price: number; //거래금액

    @Prop({ required: true })
    left: number; //잔액
}

export const RecordSchema = SchemaFactory.createForClass(Record);

RecordSchema.index({ userId: 1, createdAt: -1 });