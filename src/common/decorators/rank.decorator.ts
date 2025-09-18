import { SetMetadata } from '@nestjs/common';

export const RANK_KEY = 'rank';
export const Rank = (rank: string) => SetMetadata(RANK_KEY, rank);