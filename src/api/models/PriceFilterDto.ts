/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MeanBandDto } from "./MeanBandDto";
import type { MeanPremiumBandDto } from "./MeanPremiumBandDto";
export type PriceFilterDto = {
  borrowEntryFeeMaxMultiplier?: string | null;
  borrowEntryFeeMinMultiplier?: string | null;
  maxImpactMultiplier?: string | null;
  maxMultiplier?: string | null;
  maxPrice?: string | null;
  meanMarkPriceBand?: MeanBandDto | null;
  meanPremiumBand?: MeanPremiumBandDto | null;
  minImpactMultiplier?: string | null;
  minMultiplier?: string | null;
  minPrice?: string | null;
  tickSize?: string | null;
};
