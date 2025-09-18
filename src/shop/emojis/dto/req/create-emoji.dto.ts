import {  IsNotEmpty, IsNumber, Max } from "class-validator";

export class CreateEmojiDto {
  @IsNotEmpty()
  @Max(10)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  image: string;
}
