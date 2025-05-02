import { Length, IsIn, IsOptional } from "class-validator";
import { QueryBaseDto } from "src/common/dto/query-base.dto";

export class EmojiQueryDto extends QueryBaseDto {
    @IsOptional()
    @IsIn(['createdAt', 'attendcount', 'bancount'])
    sort?: string;
}

export class EmojiSearchDto extends QueryBaseDto {
    @Length(2, 8)
    word: string;
}