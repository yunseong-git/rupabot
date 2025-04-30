import { Types } from 'mongoose';

//기본 유틸리티 타입
export type Populate<T, K extends keyof T, R> = Omit<T, K> & {
  [P in K]: R;
};

//user.emoji 기본 구조
export interface UserEmoji {
  id: string;
  emojis: Types.ObjectId[];
}

//emoji populate 결과 구조
export interface PopulatedEmoji {
  images?: string;
}

//최종 타입 매핑
export type UserWithPopulatedEmoji = Populate<UserEmoji, 'emojis', PopulatedEmoji[]>;