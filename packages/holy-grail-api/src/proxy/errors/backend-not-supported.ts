import { NotFoundException } from "@nestjs/common";

export default class BackendNotSupportedError extends NotFoundException {
  constructor(backendId: string) {
    super(`Backend ${backendId} is not supported.`);
  }
}
