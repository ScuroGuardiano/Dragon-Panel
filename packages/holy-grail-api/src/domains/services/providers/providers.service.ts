import { Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/app-config/app-config.service';
import CloudflareProvider from './cloudflare/cloudflare.provider';
import { ProviderBase } from './provider-base';

export type TProvider = new (
  appConfigService: AppConfigService,
) => ProviderBase;

@Injectable()
export class ProvidersService {
  constructor() {
    this.registerProvider("CLOUDFLARE", CloudflareProvider);
  }

  private providers: Map<string, TProvider> = new Map();

  public registerProvider(name: string, provider: TProvider) {
    this.providers.set(name, provider);
  }

  public getProvider(name: string) {
    return this.providers.get(name);
  }

  public listProviders() {
    return Array.from(this.providers.entries()).map((entry) => entry[0]);
  }
}
