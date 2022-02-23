import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import IProxyBackend from './interfaces/proxy-backend';
import IProxyEntry from './interfaces/proxy-entry';

@Injectable({
  providedIn: 'root'
})
export class ProxyService {
  constructor(
    private http: HttpClient
  ) { }

  private selectedBackendId = 'caddy';

  get proxyUrl() {
    return `/api/proxy/${this.selectedBackendId}`
  }

  async getAvailableBackends(): Promise<IProxyBackend[]> {
    return [{
      id: 'caddy', name: 'Caddy'
    }];
  }

  async selectBackend(backendId: string) {
    const backends = await this.getAvailableBackends();

    // For my own sanity, in fact this branch should never execute
    // UI should take care of allowing to choose only available backends
    if (!backends.find(b => b.id === backendId)) {
      throw new Error(`There's no avaiable backend ${backendId}.`);
    }

    this.selectedBackendId = backendId;
  }

  // Before I'll make this API more consistent with well known response structure I will use status codes xD
  async isProxyAccessible(): Promise<boolean> {
    return true; // FIXME:

    try {
      await this.http.get(`${this.proxyUrl}/accessible`).toPromise();
      return true;
    }
    catch(err: any) {
      console.error(`Proxy accessibility check returned error: `, err);
      return false;
    }
  }

  async getProxyEntries(): Promise<IProxyEntry[]> {
    return [
      { id: '1', matcher: 'code.example.org', to: 'CodeServer:8080', enabled: true },
      { id: '2', matcher: 'blog.example.org', to: 'Containers:1337', enabled: true },
      { id: '3', matcher: 'caddy.example.org', to: 'Caddy:2016', enabled: false }
    ]; // FIXME:

    const entries = await this.http.get<IProxyEntry[]>(`${this.proxyUrl}/entries`).toPromise();
    return entries;
  }

  async addProxyEntry(matcher: string, to: string, enabled = true): Promise<IProxyEntry> {
    // TODO: implement this shit
    return <any>null;
  }

  async deleteProxyEntry(id: string): Promise<boolean> {
    // TODO: implement this shit
    return false;
  }

  async modifyProxyEntry(id: string, matcher: string, to: string): Promise<IProxyEntry> {
    // TODO: implement this shit
    return <any>null;
  }

  async enableProxyEntry(id: string): Promise<boolean> {
    // TODO: implement this shit
    return false;
  }

  async disableProxyEntry(id: string): Promise<boolean> {
    // TODO: implement this shit
    return true;
  }
}
