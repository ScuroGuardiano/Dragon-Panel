import { UnauthorizedException } from "@nestjs/common";

export default class BackendUnauthorizedError extends UnauthorizedException {
  constructor(backendId: string) {
    super(`Backend ${backendId} returned 401 Unauthorized.`);
  }
}
