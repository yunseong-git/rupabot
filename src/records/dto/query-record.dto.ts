import { IsIn, IsOptional } from "class-validator";
import { QueryBaseDto } from "src/common/dto/query-base.dto";
import { RecordType } from "../schemas/record.schema";

export class RecordQueryDto extends QueryBaseDto {
    @IsOptional()
    @IsIn([RecordType])
    sort?: string;
}