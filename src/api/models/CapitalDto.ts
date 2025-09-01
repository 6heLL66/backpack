/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CollateralDto } from "./CollateralDto";
export type CapitalDto = {
  assetsValue: string;
  borrowLiability: string;
  imf: string;
  liabilitiesValue: string;
  marginFraction?: string | null;
  mmf: string;
  netEquity: string;
  netEquityAvailable: string;
  netEquityLocked: string;
  netExposureFutures: string;
  pnlUnrealized: string;
  unsettledEquity: string;
  collateral: Array<CollateralDto>;
};
