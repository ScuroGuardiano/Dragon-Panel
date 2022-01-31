import { AppConfigService } from "src/app-config/app-config.service";
import { fetch } from 'cross-fetch';

export default class CloudflareHttpClient {
  constructor(private appConfigService: AppConfigService) {}

  public async get(url: string): Promise<Response> {
    return this.requestWithoutBody(url, "GET");
  }

  public async delete(url: string): Promise<Response> {
    return this.requestWithoutBody(url, "DELETE");
  }

  public async post<T>(url: string, body: T) {
    return this.requestWithBody(url, "POST", body);
  }

  public async put<T>(url: string, body: T) {
    return this.requestWithBody(url, "PUT", body);
  }

  public async patch<T>(url: string, body: T) {
    return this.requestWithBody(url, "PATCH", body);
  }

  private async requestWithBody(url: string, method: "PUT" | "PATCH" | "POST", body: any): Promise<Response> {
    const res = await fetch(url, {
      method,
      body,
      headers: {
        'Content-Type': "application/json",
        'Authorization': `Bearer ${await this.appConfigService.get('CF_API_KEY')}`
      }
    });

    return res;
  }

  private async requestWithoutBody(url: string, method: "GET" | "DELETE"): Promise<Response> {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': "application/json",
        'Authorization': `Bearer ${await this.appConfigService.get('CF_API_KEY')}`
      }
    });

    return res;
  }
}
