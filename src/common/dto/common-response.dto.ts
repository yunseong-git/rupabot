import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CommonResponseDto<T> {
  @Expose()
  data: T;

  @Expose()
  message: string;

  constructor(partial: Partial<CommonResponseDto<T>>) {
    Object.assign(this, partial);
  }
}
