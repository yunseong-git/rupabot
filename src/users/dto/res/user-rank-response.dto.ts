export class RequirementDetail {
  current: number;
  required: number;
  isAchieved: boolean;
}

export class GetRankConditionResDto {
  currentRank: string;
  nextRank: string;
  requirements: {
    attendCount: RequirementDetail;
    rupa: RequirementDetail;
  };
  canRankUp: boolean;
}
