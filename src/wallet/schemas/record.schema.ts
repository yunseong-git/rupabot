import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecordDocument = Record & Document;

@Schema({ timestamps: true })
export class Record {
    @Prop({ required: true })
    userId: string; // 유저  _id (추후 관계 연동)

    @Prop()
    type: string; // 종류(출석,배틀,구매)

    @Prop()
    content: string; // 종류(구매일 경우에만)

    @Prop({ required: true })
    price: number; //거래금액

    @Prop({ required: true })
    left: number; //잔액

}

export const RecordSchema = SchemaFactory.createForClass(Record);

RecordSchema.index({ userId: 1, createdAt: -1 });