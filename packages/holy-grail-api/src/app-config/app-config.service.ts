import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { appConfigSchema, IAppConfig } from './app-config.schema';
import AppConfig from './models/app-config.entity';

@Injectable()
export class AppConfigService {
    constructor(@InjectRepository(AppConfig) private appConfigRepository: Repository<AppConfig>) {}

    private config?: IAppConfig;
    
    public async getOnlyReadableConfig(): Promise<IAppConfig> {
        if (!this.config) {
            await this.loadConfig();
        }

        const readableConfig: IAppConfig = {};

        Object.keys(this.config).forEach(key => {
            const schemaEntry = appConfigSchema[key];
            if (schemaEntry && schemaEntry.readable) {
                readableConfig[key] = this.config[key];
            }
            else if(this.config[key]?.length > 0) {
                readableConfig[key] = "[HIDDEN]"
            }
        });

        return readableConfig;
    }

    public async setConfig(config: IAppConfig) {
        await Promise.all(Object.keys(config).map(async key => {
            await this.set(key, config[key]);
        }));
    }

    public async get(key: string): Promise<string | null> {
        if(!this.config) {
            await this.loadConfig();
        }

        if (this.config[key]) {
            return this.config[key];
        }

        const schemaEntry = appConfigSchema[key];
        if (schemaEntry && schemaEntry.default) {
            return schemaEntry.default;
        }

        return null;
    }

    public async set(key: string, value: string): Promise<boolean> {
        if(!this.config) {
            await this.loadConfig();
        }

        if (appConfigSchema[key] && appConfigSchema[key].writable) {
            this.config[key] = value;
            await this.appConfigRepository.save(AppConfig.fromConfigObject(this.config, appConfigSchema));
            return true;
        }

        return false;
    }

    public async setNonWritable(key: string, value: string): Promise<void> {
        if(!this.config) {
            await this.loadConfig();
        }
        this.config[key] = value;
        await this.appConfigRepository.save(AppConfig.fromConfigObject(this.config, appConfigSchema));
    }

    private async loadConfig(): Promise<void> {
        const configs = await this.appConfigRepository.find();
        const config: IAppConfig = {};
        configs.forEach(c => {
            config[c.key] = c.value;
        });
        this.config = config;
    }

}
