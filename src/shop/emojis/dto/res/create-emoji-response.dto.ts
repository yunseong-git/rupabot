import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateEmojiResponseDto {
  @Expose()
  name: string;

  @Expose()
  image: string;
}