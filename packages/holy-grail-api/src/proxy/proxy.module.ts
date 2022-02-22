import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { AuthModule } from 'src/auth/auth.module';
import { ProxyService } from './proxy.service';
import { ProxyController } from './proxy.controller';
import ProxyEntry from './models/proxy-entry.entity';

@Module({
  imports: [
    AuthModule,
    AppConfigModule,
    TypeOrmModule.forFeature([ProxyEntry])
  ],
  providers: [ProxyService],
  controllers: [ProxyController]
})
export class ProxyModule {
}
