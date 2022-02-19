import { GatewayTimeoutException } from "@nestjs/common";

export default class BackendTimeoutError extends GatewayTimeoutException {
  constructor(backendId: string) {
    super(`Backend ${backendId} timeouted.`);
  }
}
