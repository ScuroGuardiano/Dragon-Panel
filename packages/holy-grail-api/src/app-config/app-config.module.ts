import { Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { AppConfigController } from './app-config.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppConfig from './models/app-config.entity';

@Module({
  providers: [AppConfigService],
  controllers: [AppConfigController],
  imports: [TypeOrmModule.forFeature([AppConfig])]
})
export class AppConfigModule {}
