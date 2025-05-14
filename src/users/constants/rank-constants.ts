export const RANK_ORDER = ['응애루파', '루파', '골드루파', '에매루파', '다이아루파', '루비루파', '루파킹'] as const;

export type RankType = (typeof RANK_ORDER)[number];

export const RANK_CONDITIONS: Record<RankType, { attendcount: number; rupa: number }> = {
  루파: { attendcount: 5, rupa: 500 },
  골드루파: { attendcount: 10, rupa: 2000 },
  에매루파: { attendcount: 17, rupa: 4000 },
  다이아루파: { attendcount: 30, rupa: 10000 },
  루비루파: { attendcount: 90, rupa: 50000 },
  루파킹: { attendcount: 365, rupa: 200000 },
  응애루파: { attendcount: 0, rupa: 0 },
};
