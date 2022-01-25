import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { DomainProviderFactory } from './services/domain-provider-factory.service';
import { ProviderBase } from './services/providers/provider-base';

@UseGuards(JwtAuthGuard)
@Controller('domains')
export class DomainsController {
  constructor(private domainProviderFactory: DomainProviderFactory) {
    // Yea currently I hardcoded cloudflare but I created this Domains module
    // to be extensible, later I will add option in config to choose provider.
    this.provider = domainProviderFactory.construct("CLOUDFLARE");
  }

  private provider: ProviderBase;
  private logger = new Logger(DomainsController.name);

  @Get('/verify')
  async verify() {
    try {
      const canConnect = await this.provider.canConnect();
      return {
        success: canConnect
      }
    }
    catch(err) {
      this.logger.error(err);
    }
  }
}
