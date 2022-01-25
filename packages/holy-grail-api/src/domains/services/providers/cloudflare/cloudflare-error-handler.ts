import { BadRequestException, HttpException, HttpStatus, Logger } from "@nestjs/common";
import InvalidApiTokenException from "../errors/invalid-api-token";
import NoPermissionsException from "../errors/no-permissions";
import ProviderReturned5xxException from "../errors/provider-returned-5xx";
import CloudflareResponse from "./interfaces/cf-response";

export default class CloudflareErrorHandler {
  private logger = new Logger("Cloudflare");

  handleError(err: any) {
    throw err;
  }
  
  async handleErrorResponse(res: Response) {
    this.logger.error(`Status: ${res.status} ${res.statusText}, body: ${await res.text()}`);

    if (res.status >= 500 && res.status <= 599) {
      throw new ProviderReturned5xxException("CLOUDFLARE", res.status);
    }

    if (res.status === HttpStatus.UNAUTHORIZED) {
      throw new InvalidApiTokenException("CLOUDFLARE");
    }

    if (res.status === HttpStatus.FORBIDDEN) {
      throw new NoPermissionsException("CLOUDFLARE", res.url);
    }

    if (res.status === HttpStatus.TOO_MANY_REQUESTS) {
      throw new HttpException("[CLOUDFLARE]: Too many requests", HttpStatus.TOO_MANY_REQUESTS);
    }

    if (res.status === HttpStatus.BAD_REQUEST) {
      const body = await res.json() as CloudflareResponse<void>;
      if (!body || !(body.errors instanceof Array) || body.errors.length === 0) {
        throw new BadRequestException("[CLOUDFLARE]: Returned unknown 400 Bad Request with no error details");
      }
      const errorCode = body.errors[0].code;
      const errorMessage = body.errors[0].message;

      switch(errorCode) {
        case 9106:
        case 10000:
          throw new InvalidApiTokenException("CLOUDFLARE");

        default:
          throw new BadRequestException(`[CLOUDFLARE]: Returned bad request: code: ${errorCode} message: ${errorMessage}`);
      }
    }

    throw new HttpException("[CLOUDFLARE]: Returned unknown exception", res.status);
  }
}
