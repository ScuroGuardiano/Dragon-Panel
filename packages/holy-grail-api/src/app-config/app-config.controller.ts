import { BadRequestException, Body, Controller, Get, HttpCode, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
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

    @Post('/')
    @HttpCode(204)
    async setConfig(@Body() config: IAppConfig) {
        if (!config) {
            throw new BadRequestException();
        }
        await this.appConfigService.setConfig(config);
    }

    @Get('/schema')
    async getConfigSchema(): Promise<IAppConfigSchema> {
        return appConfigSchema;
    }

    @Get('/:key')
    async getByKey(@Param('key') key: string) {
        const val = (await this.appConfigService.getOnlyReadableConfig())[key];
        if (val) {
            return { key, value: val };
        }
        throw new NotFoundException();
    }

    @Post('/:key')
    async setByKey(@Param('key') key: string, @Body() body: { value: string }) {
        if (!body.value) {
            throw new BadRequestException();
        }
        return this.appConfigService.set(key, body.value);
    }
}
