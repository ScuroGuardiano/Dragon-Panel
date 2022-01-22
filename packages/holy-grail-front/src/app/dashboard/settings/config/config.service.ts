import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAppConfigSchema } from './config-interfaces';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor(
    private httpClient: HttpClient
  ) { }

  public async getConfigSchema() {
    const schema = await this.httpClient
      .get<IAppConfigSchema>('/api/config/schema')
      .toPromise();

    return schema;
  }
}
