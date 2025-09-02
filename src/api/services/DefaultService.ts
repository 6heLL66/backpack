/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderHistoryAction } from "../models/OrderHistoryAction";
import type { PaginatedResponseDto_OrderHistoryDto_ } from "../models/PaginatedResponseDto_OrderHistoryDto_";
import type { UnitCreateRequestDto } from "../models/UnitCreateRequestDto";
import type { UnitDto } from "../models/UnitDto";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class DefaultService {
  /**
   * Unit Create
   * @returns UnitDto Successful Response
   * @throws ApiError
   */
  public static unitCreateApiBackpackUnitsPost({
    requestBody,
  }: {
    requestBody: UnitCreateRequestDto;
  }): CancelablePromise<UnitDto> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/backpack/units",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Units List
   * @returns UnitDto Successful Response
   * @throws ApiError
   */
  public static unitsListApiBackpackUnitsGet({
    isActive,
  }: {
    isActive?: boolean | null;
  }): CancelablePromise<Array<UnitDto>> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/backpack/units",
      query: {
        is_active: isActive,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Unit Delete
   * @returns void
   * @throws ApiError
   */
  public static unitDeleteApiBackpackUnitsUnitIdDelete({
    unitId,
  }: {
    unitId: string;
  }): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/backpack/units/{unit_id}",
      path: {
        unit_id: unitId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Units History
   * @returns PaginatedResponseDto_OrderHistoryDto_ Successful Response
   * @throws ApiError
   */
  public static unitsHistoryApiBackpackUnitsHistoryGet({
    unitId,
    accountId,
    action,
    createdAtGte,
    createdAtLte,
    limit = 100,
    offset,
    sortedBy = "created_at",
  }: {
    unitId?: string | null;
    accountId?: string | null;
    action?: OrderHistoryAction | null;
    createdAtGte?: string | null;
    createdAtLte?: string | null;
    limit?: number;
    offset?: number;
    sortedBy?: "created_at" | "-created_at";
  }): CancelablePromise<PaginatedResponseDto_OrderHistoryDto_> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/backpack/units/history",
      query: {
        unit_id: unitId,
        account_id: accountId,
        action: action,
        created_at__gte: createdAtGte,
        created_at__lte: createdAtLte,
        limit: limit,
        offset: offset,
        sorted_by: sortedBy,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
