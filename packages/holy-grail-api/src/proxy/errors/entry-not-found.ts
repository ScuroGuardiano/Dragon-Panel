import { NotFoundException } from "@nestjs/common";

export default class EntryNotFoundError extends NotFoundException {
  constructor(id: string) {
    super(`Proxy entry with id ${id} does not exists.`);
  }
}
