import { BadRequestException } from "@nestjs/common";

export default class DuplicateMatcherError extends BadRequestException {
  constructor(matcher: string) {
    super(`The matcher ${matcher} already exists in proxy. You can't create 2`);
  }
}
