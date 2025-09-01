/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BatchCreateRequestDto } from "../models/BatchCreateRequestDto";
import type { BatchDto } from "../models/BatchDto";
import type { BatchUpdateDto } from "../models/BatchUpdateDto";
import type { CapitalDto } from "../models/CapitalDto";
import type { IntegrationAccountCreateRequestDto } from "../models/IntegrationAccountCreateRequestDto";
import type { IntegrationAccountDto } from "../models/IntegrationAccountDto";
import type { IntegrationAccountUpdateDto } from "../models/IntegrationAccountUpdateDto";
import type { OrderDto } from "../models/OrderDto";
import type { PositionDto } from "../models/PositionDto";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class AccountService {
  /**
   * Accounts List
   * @returns IntegrationAccountDto Successful Response
   * @throws ApiError
   */
  public static accountsListApiBackpackAccountsGet(): CancelablePromise<
    Array<IntegrationAccountDto>
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/backpack/accounts",
    });
  }
  /**
   * Account Create
   * @returns IntegrationAccountDto Successful Response
   * @throws ApiError
   */
  public static accountCreateApiBackpackAccountsPost({
    requestBody,
  }: {
    requestBody: IntegrationAccountCreateRequestDto;
  }): CancelablePromise<IntegrationAccountDto> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/backpack/accounts",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Accounts Balances
   * @returns CapitalDto Successful Response
   * @throws ApiError
   */
  public static accountsBalancesApiBackpackAccountsBalancesGet({
    accountIds,
  }: {
    accountIds: Array<string>;
  }): CancelablePromise<Record<string, CapitalDto>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/backpack/accounts/balances",
      query: {
        account_ids: accountIds,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Accounts Orders
   * @returns OrderDto Successful Response
   * @throws ApiError
   */
  public static accountsOrdersApiBackpackAccountsOrdersGet({
    accountIds,
    symbol,
  }: {
    accountIds: Array<string>;
    symbol?: string | null;
  }): CancelablePromise<Record<string, Array<OrderDto>>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/backpack/accounts/orders",
      query: {
        symbol: symbol,
        account_ids: accountIds,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Cancel All Orders
   * @returns void
   * @throws ApiError
   */
  public static cancelAllOrdersApiBackpackAccountsOrdersDelete({
    symbol,
    accountIds,
  }: {
    symbol: string;
    accountIds: Array<string>;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/backpack/accounts/orders",
      query: {
        symbol: symbol,
        account_ids: accountIds,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Accounts Positions
   * @returns PositionDto Successful Response
   * @throws ApiError
   */
  public static accountsPositionsApiBackpackAccountsPositionsGet({
    accountIds,
    symbol,
  }: {
    accountIds: Array<string>;
    symbol?: string | null;
  }): CancelablePromise<Record<string, Array<PositionDto>>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/backpack/accounts/positions",
      query: {
        symbol: symbol,
        account_ids: accountIds,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Cancel Position
   * @returns void
   * @throws ApiError
   */
  public static cancelPositionApiBackpackAccountsPositionsDelete({
    symbol,
    accountIds,
  }: {
    symbol: string;
    accountIds: Array<string>;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/backpack/accounts/positions",
      query: {
        symbol: symbol,
        account_ids: accountIds,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Account Update
   * @returns IntegrationAccountDto Successful Response
   * @throws ApiError
   */
  public static accountUpdateApiBackpackAccountsAccountIdPatch({
    accountId,
    requestBody,
  }: {
    accountId: string;
    requestBody: IntegrationAccountUpdateDto;
  }): CancelablePromise<IntegrationAccountDto> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/backpack/accounts/{account_id}",
      path: {
        account_id: accountId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Account Delete
   * @returns void
   * @throws ApiError
   */
  public static accountDeleteApiBackpackAccountsAccountIdDelete({
    accountId,
  }: {
    accountId: string;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/backpack/accounts/{account_id}",
      path: {
        account_id: accountId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Batch List
   * @returns BatchDto Successful Response
   * @throws ApiError
   */
  public static batchListApiBackpackBatchesGet(): CancelablePromise<
    Array<BatchDto>
  > {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/backpack/batches",
    });
  }
  /**
   * Batch Create
   * @returns BatchDto Successful Response
   * @throws ApiError
   */
  public static batchCreateApiBackpackBatchesPost({
    requestBody,
  }: {
    requestBody: BatchCreateRequestDto;
  }): CancelablePromise<BatchDto> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/backpack/batches",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Batch Update
   * @returns BatchDto Successful Response
   * @throws ApiError
   */
  public static batchUpdateApiBackpackBatchesBatchIdPatch({
    batchId,
    requestBody,
  }: {
    batchId: string;
    requestBody: BatchUpdateDto;
  }): CancelablePromise<BatchDto> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/backpack/batches/{batch_id}",
      path: {
        batch_id: batchId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Batch Delete
   * @returns void
   * @throws ApiError
   */
  public static batchDeleteApiBackpackBatchesBatchIdDelete({
    batchId,
  }: {
    batchId: string;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/backpack/batches/{batch_id}",
      path: {
        batch_id: batchId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
