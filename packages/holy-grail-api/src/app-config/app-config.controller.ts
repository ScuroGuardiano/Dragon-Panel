import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { appConfigSchema, IAppConfig, IAppConfigSchema } from './app-config.schema';
import { AppConfigService } from './app-config.service';

@Controller('config')
@UseGuards(JwtAuthGuard)
export class AppConfigController {
    constructor(private appConfigService: AppConfigService) {}
    @Get('/')
    async getConfig(): Promise<IAppConfig> {
        return this.appConfigService.getOnlyReadableConfig();
    }

    @Get('/schema')
    async getConfigSchema(): Promise<IAppConfigSchema> {
        return appConfigSchema;
    }

}
