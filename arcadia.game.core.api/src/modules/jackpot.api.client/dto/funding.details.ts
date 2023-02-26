export class FundingDetails {
  playerContributionPercentage: number;
  operatorContributionPercentage: number;
  fundingContributionType: 'PERCENTAGE' | 'FIXED';
  houseEdgePercentage: number;
  jackpotContributionValue: number;
  minWagerCondition: number;
  minContribution: number;
}