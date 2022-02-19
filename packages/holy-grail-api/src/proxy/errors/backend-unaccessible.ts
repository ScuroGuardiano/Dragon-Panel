import { ServiceUnavailableException } from "@nestjs/common";

export default class BackendUnaccessibleError extends ServiceUnavailableException {
  constructor(backendId: string) {
    super(`Backend ${backendId} is currently not accessible.`);
  }
}
