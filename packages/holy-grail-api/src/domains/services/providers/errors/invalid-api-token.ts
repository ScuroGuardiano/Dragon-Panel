import { HttpException, HttpStatus } from "@nestjs/common";

export default class InvalidApiTokenException extends HttpException {
  constructor(service: string) {
    super(`[${service}]: Invalid API Token.`, HttpStatus.FORBIDDEN);
    this.name = InvalidApiTokenException.name;
  }
}
