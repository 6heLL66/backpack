/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MarketDto } from "../models/MarketDto";
import type { MarketPriceDto } from "../models/MarketPriceDto";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class MarketsService {
  /**
   * Get Markets
   * @returns MarketDto Successful Response
   * @throws ApiError
   */
  public static getMarketsApiBackpackMarketsGet(): CancelablePromise<
    Array<MarketDto>
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/backpack/markets",
    });
  }
  /**
   * Get Mark Prices
   * @returns MarketPriceDto Successful Response
   * @throws ApiError
   */
  public static getMarkPricesApiBackpackMarketsPricesGet(): CancelablePromise<
    Array<MarketPriceDto>
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/backpack/markets/prices",
    });
  }
}
