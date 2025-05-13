import { QueryBaseDto } from "src/common/dto/query-base.dto";
import { IsNotEmpty } from "class-validator";

export namespace CommentQueryDto {
    export class Reply extends QueryBaseDto {
        @IsNotEmpty()
        commentId: string
    }
    export class My extends QueryBaseDto { }
}