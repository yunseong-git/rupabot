import { Max, IsOptional} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryBaseDto {
    @IsOptional()
    @Type(() => Number)
    @Max(100)
    limit?: number;

    @IsOptional()
    @Type(() => Number)
    skip?: number;
}