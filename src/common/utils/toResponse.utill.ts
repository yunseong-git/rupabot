import { ClassConstructor } from 'class-transformer';
import { plainToInstance } from 'class-transformer';

/**단일 데이터 응답*/
export function toResponse<T>(cls: ClassConstructor<T>, data: T) {
  return plainToInstance(cls, data, { excludeExtraneousValues: true });
}

/**배열 데이터 응답*/
export function toResponseArray<T>(cls: ClassConstructor<T>, data: T[]) {
  return plainToInstance(cls, data, { excludeExtraneousValues: true });
}

export function toCommandResponse(id: string, message: string) {
  return {
    data: { id },
    message,
  };
}

export type CommonCommandResponse = {
  data: { id: string };
  message: string;
};
