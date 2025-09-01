/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserDto } from "../models/UserDto";
import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request } from "../core/request";
export class UserService {
  /**
   * User Me
   * @returns UserDto Successful Response
   * @throws ApiError
   */
  public static userMeApiUsersMeGet(): CancelablePromise<UserDto> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/users/me",
    });
  }
}
