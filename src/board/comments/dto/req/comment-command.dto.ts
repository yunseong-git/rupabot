import { IsString, IsNotEmpty, MaxLength, IsMongoId } from 'class-validator';

export namespace CommentCommandDto {
  export class Create {
    @IsMongoId()
    @IsNotEmpty()
    postId!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(300)
    content!: string;
  }

  export class CreateReply extends Create {
    @IsMongoId()
    @IsNotEmpty()
    pId!: string;
  }

  export class Update extends Create {
    @IsMongoId()
    @IsNotEmpty()
    commentId!: string;
  }

  export class Delete extends Create {

  }
}





