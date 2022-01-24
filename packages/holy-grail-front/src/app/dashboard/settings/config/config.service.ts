import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAppConfig, IAppConfigSchema, IAppConfigSchemaEntry } from './config-interfaces';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor(
    private httpClient: HttpClient
  ) { }

  private schema?: IAppConfigSchema;

  public async getConfigSchema() {
    if (this.schema) {
      return Promise.resolve(this.schema);
    }
    const schema = await this.httpClient
      .get<IAppConfigSchema>('/api/config/schema')
      .toPromise();

    this.schema = schema;

    return schema;
  }

  public async saveConfig(config: IAppConfig) {
    const configOnServer = await this.getConfig();
    const modifiedConfig: IAppConfig = {};

    // I want to send only modified values, as backend returns me some shit like "[HIDDEN]" if value is hidden.
    // I don't want to save that to server.
    Object.keys(config)
    .filter(key => config[key] != configOnServer[key])
    .forEach(key => {
      modifiedConfig[key] = config[key];
    });

    await this.httpClient.post('/api/config', modifiedConfig).toPromise();
  }

  public async getConfig() {
    const config = await this.httpClient
      .get<IAppConfig>('/api/config')
      .toPromise();

    return { ...await this.generateDefaultConfig(), ...config };
  }

  private async generateDefaultConfig() {
    const schema = await this.getConfigSchema();
    const config: IAppConfig = {};
    Object.keys(schema).forEach(key => {
      if (schema[key].default) {
        config[key] = schema[key].default;
      }
      config[key] = '';
    });

    return config;
  }
}
