import { BadGatewayException } from "@nestjs/common";
import { inspect } from "util";

export default class BackendReturned5xxError extends BadGatewayException {
  constructor(backendId: string, error: any) {
    super(`Backend ${backendId} returned 5xx error. Details: ${inspect(error)}`);
  }
}
