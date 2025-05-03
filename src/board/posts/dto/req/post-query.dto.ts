import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class BaseQueryDto {
    @IsOptional()
    @IsIn(['cs', 'free'])
    type?: string;

    @IsOptional()
    @Type(() => Number)
    limit?: number;

    @IsOptional()
    @Type(() => Number)
    skip?: number;
}

export class PostQueryDto extends BaseQueryDto {
    @IsOptional()
    @IsIn(['latest', 'like'])
    sort?: string;
}

export class LikedPostQueryDto extends BaseQueryDto { }

export class SearchedPostQueryDto extends BaseQueryDto {
    @IsNotEmpty()
    word!: string;
}

export class DeletedPostQueryDto extends BaseQueryDto {
    @IsOptional()
    word?: string;
}