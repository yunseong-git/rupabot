import { IsOptional, IsIn, IsNotEmpty } from 'class-validator';
import { QueryBaseDto } from 'src/common/dto/query-base.dto';


export namespace PostQueryDto {
    class Based extends QueryBaseDto {
        @IsOptional()
        @IsIn(['cs', 'free'])
        type?: string;
    }
    export class Liked extends Based { }
    export class All extends Based {
        @IsOptional()
        @IsIn(['latest', 'like'])
        sort?: string;
    }
    export class Search extends All {
        @IsNotEmpty()
        word!: string;
    }
    export class Deleted extends All {
        @IsOptional()
        word?: string;
    }
    export class WithComments extends QueryBaseDto {
        @IsNotEmpty()
        postId: string

        @IsOptional()
        @IsIn(['latest', 'like'])
        sort?: string;
    }
}
