import { BadRequestException } from "@nestjs/common";
import { inspect } from "util";

export default class BackendReturned4xxError extends BadRequestException {
  constructor(backendId: string, error: any) {
    super(`Backend ${backendId} returned 4xx error. Details: ${inspect(error)}`);
  }
}
