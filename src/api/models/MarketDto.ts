/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FunctionConfigDto } from "./FunctionConfigDto";
import type { MarketFiltersDto } from "./MarketFiltersDto";
export type MarketDto = {
  baseSymbol: string;
  createdAt: string;
  filters: MarketFiltersDto;
  fundingInterval?: number | null;
  fundingRateLowerBound?: string | null;
  fundingRateUpperBound?: string | null;
  imfFunction?: FunctionConfigDto | null;
  marketType: string;
  mmfFunction?: FunctionConfigDto | null;
  openInterestLimit?: string | null;
  orderBookState: string;
  quoteSymbol: string;
  symbol: string;
};
