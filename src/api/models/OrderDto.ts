/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderSide } from "./OrderSide";
import type { OrderType } from "./OrderType";
import type { SelfTradePrevention } from "./SelfTradePrevention";
import type { TimeInForce } from "./TimeInForce";
export type OrderDto = {
  clientId?: string | null;
  createdAt: string;
  executedQuantity: string;
  executedQuoteQuantity: string;
  id: string;
  orderType: OrderType;
  postOnly?: boolean | null;
  price?: string | null;
  quantity: string;
  reduceOnly?: boolean | null;
  relatedOrderId?: string | null;
  selfTradePrevention: SelfTradePrevention;
  side: OrderSide;
  status: string;
  stopLossLimitPrice?: string | null;
  stopLossTriggerBy?: string | null;
  stopLossTriggerPrice?: string | null;
  strategyId?: string | null;
  symbol: string;
  takeProfitLimitPrice?: string | null;
  takeProfitTriggerBy?: string | null;
  takeProfitTriggerPrice?: string | null;
  timeInForce: TimeInForce;
  triggerBy?: string | null;
  triggerPrice?: string | null;
  triggerQuantity?: string | null;
  triggeredAt?: string | null;
};
