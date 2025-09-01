/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RefreshDto } from "../models/RefreshDto";
import type { TokenDto } from "../models/TokenDto";
import type { UserAuthDto } from "../models/UserAuthDto";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class AuthService {
  /**
   * Register
   * @returns TokenDto Successful Response
   * @throws ApiError
   */
  public static registerApiAuthRegisterPost({
    requestBody,
  }: {
    requestBody: UserAuthDto;
  }): CancelablePromise<TokenDto> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/auth/register",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Login
   * @returns TokenDto Successful Response
   * @throws ApiError
   */
  public static loginApiAuthLoginPost({
    requestBody,
  }: {
    requestBody: UserAuthDto;
  }): CancelablePromise<TokenDto> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/auth/login",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
  /**
   * Refresh
   * @returns TokenDto Successful Response
   * @throws ApiError
   */
  public static refreshApiAuthRefreshPost({
    requestBody,
  }: {
    requestBody: RefreshDto;
  }): CancelablePromise<TokenDto> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/auth/refresh",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
