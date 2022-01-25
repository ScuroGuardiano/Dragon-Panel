import { ForbiddenException } from "@nestjs/common";

export default class NoPermissionsException extends ForbiddenException {
  constructor(service: string, route?: string) {
    super(`[${service}]: No permissions for accessing ${route ?? 'uknown route'}`);
    this.name = NoPermissionsException.name;
  }
}
