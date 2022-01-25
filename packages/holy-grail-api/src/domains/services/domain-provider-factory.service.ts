import { Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/app-config/app-config.service';
import { ProvidersService } from './providers/providers.service';

@Injectable()
export class DomainProviderFactory {
  constructor(
    private appConfigService: AppConfigService,
    private providersService: ProvidersService,
  ) {}

  public listProviders() {
    return this.providersService.listProviders();
  }

  public construct(name: string) {
    const Provider = this.providersService.getProvider(name);
    if (!Provider) {
      throw new Error(`Provider ${name} does not exist!`);
    }
    return new Provider(this.appConfigService);
  }
}
