import { Exclude, Expose } from "class-transformer";
import { RecordType } from "../schemas/record.schema";

@Exclude()
export class RecordQueryResponseDto {
    @Expose()
    type: RecordType;

    @Expose()
    content: string;

    @Expose()
    price: number;

    @Expose()
    left: number;
}

@Exclude()
export class AdminRecordQueryResponseDto extends RecordQueryResponseDto{
    @Expose()
    nickname: string;
}