import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export namespace PostCommandDTO {
  export class Create {
    @IsString()
    @IsNotEmpty()
    @MaxLength(300)
    title!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(300)
    content!: string;

    tag: string;
  }
  export class Update extends PartialType(Create) { }
}