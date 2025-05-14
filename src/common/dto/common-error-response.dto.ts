import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CommonErrorResponseDto {
  @Expose()
  statusCode: number;

  @Expose()
  message: string;

  @Expose()
  error: string; // 예: 'Bad Request', 'Unauthorized', 'Internal Server Error' 등

  constructor(partial: Partial<CommonErrorResponseDto>) {
    Object.assign(this, partial);
  }
}