/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderForHistoryDto } from "./OrderForHistoryDto";
import type { OrderHistoryAction } from "./OrderHistoryAction";
export type OrderHistoryDto = {
  id: string;
  unit_id: string;
  account_id: string;
  action: OrderHistoryAction;
  error?: string | null;
  order?: OrderForHistoryDto | null;
  created_at: string;
  email: string;
};
