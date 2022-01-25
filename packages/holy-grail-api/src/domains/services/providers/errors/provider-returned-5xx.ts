import { HttpException, HttpStatus } from "@nestjs/common";

export default class ProviderReturned5xxException extends HttpException {
  constructor(service: string, statusCode: number) {
    super(`[${service}]: Returned code ${statusCode}. Provider can be temporary unavailable`, HttpStatus.BAD_GATEWAY);
    this.name = ProviderReturned5xxException.name;
  }
}
