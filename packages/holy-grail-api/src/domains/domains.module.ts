import { Module } from '@nestjs/common';
import { ProvidersService } from './services/providers/providers.service';
import { DomainProviderFactory } from './services/domain-provider-factory.service';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { DomainsController } from './domains.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AppConfigModule, AuthModule],
  providers: [ProvidersService, DomainProviderFactory],
  controllers: [DomainsController]
})
export class DomainsModule {}
