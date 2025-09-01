/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderSide } from "./OrderSide";
import type { OrderType } from "./OrderType";
export type OrderForHistoryDto = {
  symbol: string;
  size: string;
  price?: string | null;
  order_type?: OrderType | null;
  side?: OrderSide | null;
};
