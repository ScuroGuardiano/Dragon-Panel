import { Logger } from "@nestjs/common";
import BackendReturned4xxError from "src/proxy/errors/backend-returned-4xx";
import BackendReturned5xxError from "src/proxy/errors/backend-returned-5xx";
import BackendTimeoutError from "src/proxy/errors/backend-timeout";
import DuplicateMatcherError from "src/proxy/errors/duplicate-matcher";
import EntryNotFoundError from "src/proxy/errors/entry-not-found";
import IProxyAddEntry from "src/proxy/interfaces/proxy-add-entry";
import ProxyBackend from "src/proxy/interfaces/proxy-backend";
import IProxyEntry from "src/proxy/interfaces/proxy-entry";
import ProxyEntry from "src/proxy/interfaces/proxy-entry";
import ProxyModifyEntry from "src/proxy/interfaces/proxy-modify-entry";
import ProxyBackendBase from "../proxy-backend-base";
import CaddyHttpClient from "./caddy-http-client";
import { CaddyManagedProxyRoute, CaddyRoute, CaddyServers } from "./caddy-interfaces";
import CaddyUtils from "./caddy-utils";

export default class CaddyBackend extends ProxyBackendBase {
  private api = this.config.get("CADDY_ADMIN_API");
  private logger = new Logger("CaddyBackend");
  private http = new CaddyHttpClient(this.config);
  private utils = new CaddyUtils();

  details(): ProxyBackend {
    return {
      name: "Caddy",
      id: "caddy"
    }
  }

  async isAccessible(): Promise<boolean> {
    try {
      await this.http.get(`${await this.api}/config/apps/http/servers`);
      return true;
    }
    catch (err) {
      this.logger.error(err);
      return false;
    }
  }

  async getManagedEntries(): Promise<ProxyEntry[]> {
    const servers = await this.getServersConfig();
    const entries = this.utils.managedProxyEntriesFromServers(servers);
    return entries.map(entry => {
      return {
        id: entry.id,
        matcher: entry.match,
        upstreams: entry.upstreams,
        enabled: true
      }
    });
  }

  async getUnmanagedEntries(): Promise<ProxyEntry[]> {
    const servers = await this.getServersConfig();
    const entries = this.utils.unmanagedProxyEntriesFromServers(servers);
    return entries.map(entry => {
      return {
        id: entry.id ?? '[NON_MANAGED]',
        matcher: entry.match,
        upstreams: entry.upstreams,
        enabled: true
      }
    });
  }

  async getManagedEntryById(id: string): Promise<ProxyEntry> {
    try {
      const response = await this.http.get(`${await this.api}/id/${id}`);
      const route = await response.json() as CaddyManagedProxyRoute;
      const entry = this.utils.parseManagedProxyRoute(route);
      return {
        id: entry.id,
        matcher: entry.match,
        upstreams: entry.upstreams,
        enabled: true
      };
    }
    catch (err) {
      if (err.status && err.status === 500) {
        // AFAIK Caddy returns 500 if id is not found.
        // TODO: I must check body tho
        throw new EntryNotFoundError(id);
      }
      this.handleCommonError(err);
    }
  }

  /**
   * Creates entry without adding it proxy server
   * @param entry 
   */
  createEntry(entry: IProxyAddEntry): IProxyEntry {
    const route = this.utils.createProxyRoute(entry.matcher, entry.upstreams[0]);
    const id = route["@id"];

    return {
      id,
      matcher: entry.matcher,
      upstreams: entry.upstreams,
      enabled: entry.enabled ?? true
    }
  }

  async addEntry(entry: IProxyEntry): Promise<IProxyEntry> {
    const servers = await this.getServersConfig();
    const firstServer = Object.keys(servers)[0];
    const duplicate = this.utils.findByMatch(servers, entry.matcher);
    if (duplicate) {
      throw new DuplicateMatcherError(entry.matcher);
    }

    const route = this.utils.createProxyRoute(entry.matcher, entry.upstreams[0], entry.id);

    try {
      await this.http.post<CaddyRoute>(`${await this.api}/config/apps/http/servers/${firstServer}/routes`, route);
      return {
        id: entry.id,
        matcher: entry.matcher,
        upstreams: entry.upstreams,
        enabled: true,
        activatedInProxy: true
      }
    }
    catch (err) {
      this.handleCommonError(err);
    }
  }

  async deleteEntry(id: string): Promise<void> {
    try {
      await this.http.delete(`${await this.api}/id/${id}`);
    }
    catch (err) {
      this.handleCommonError(err);
    }
  }

  async modifyEntry(id: string, entry: ProxyModifyEntry): Promise<IProxyEntry> {
    const existingEntry = await this.getManagedEntryById(id);
    const modifiedEntry = { ...existingEntry, ...entry };
    const newRoute = this.utils.createProxyRoute(modifiedEntry.matcher, modifiedEntry.upstreams[0], id);
    try {
      await this.http.patch<CaddyRoute>(`${await this.api}/id/${id}`, newRoute);
      return modifiedEntry;
    }
    catch (err) {
      this.handleCommonError(err);
    }
  }

  async entryExists(id: string) {
    try {
      const entry = this.getManagedEntryById(id);
      if (entry) {
        return true;
      }
    }
    catch (err) {
      if (err instanceof EntryNotFoundError) {
        return false;
      }
      throw err;
    }
  }

  private async getServersConfig() {
    try {
      const serversResponse = await this.http.get(`${await this.api}/config/apps/http/servers`);
      const servers = await serversResponse.json() as CaddyServers;
      return servers;
    }
    catch (err) {
      this.logger.error(err);
      this.handleCommonError(err);
    }
  }

  handleCommonError(err: any) {
    this.logger.error(err, err.stack);

    if (err.type && err.type === "aborted") {
      throw new BackendTimeoutError(this.details().id);
    }

    if (err.status && err.status >= 500 && err.status <= 599) {
      throw new BackendReturned5xxError(this.details().id, err);
    }

    if (err.status && err.status >= 400 && err.status <= 499) {
      throw new BackendReturned4xxError(this.details().id, err);
    }

    throw err;
  }
}
