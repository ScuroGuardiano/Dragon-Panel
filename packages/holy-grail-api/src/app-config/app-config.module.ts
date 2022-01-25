import { Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { AppConfigController } from './app-config.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppConfig from './models/app-config.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [AppConfigService],
  controllers: [AppConfigController],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([AppConfig])
  ],
  exports: [AppConfigService]
})
export class AppConfigModule {}
