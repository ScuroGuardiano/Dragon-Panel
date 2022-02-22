import { AppConfigService } from "src/app-config/app-config.service";
import timeoutFetch from "src/utils/timeout-fetch";

export default class CaddyHttpClient {
  constructor(private appConfigService: AppConfigService) {}

  private async getAuth(): Promise<string> {
    const username = await this.appConfigService.get('CADDY_USERNAME');
    const password = await this.appConfigService.get('CADDY_PASSWORD');
    const authBase64 = Buffer.from(`${username} ${password}`).toString('base64');
    return `Basic ${authBase64}`;
  }

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
    const res = await timeoutFetch(20000, url, {
      method,
      body: JSON.stringify(body),
      headers: {
        'Content-type': "application/json",
        'Authorization': await this.getAuth()
      }
    });

    return res;
  }

  private async requestWithoutBody(url: string, method: "GET" | "DELETE"): Promise<Response> {
    const res = await timeoutFetch(20000, url, {
      method,
      headers: {
        'Content-type': "application/json",
        'Authorization': await this.getAuth()
      }
    });

    return res;
  }
}
