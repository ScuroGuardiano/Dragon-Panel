import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppConfigService } from 'src/app-config/app-config.service';
import { Connection, Repository } from 'typeorm';
import { inspect } from 'util';
import CaddyBackend from './backends/caddy/caddy-backend';
import ProxyBackendBase from './backends/proxy-backend-base';
import BackendNotSupportedError from './errors/backend-not-supported';
import EntryNotFoundError from './errors/entry-not-found';
import IProxyAddEntry from './interfaces/proxy-add-entry';
import IProxyEntry from './interfaces/proxy-entry';
import IProxyModifyEntry from './interfaces/proxy-modify-entry';
import ProxyEntry from './models/proxy-entry.entity';

@Injectable()
export class ProxyService {
  private logger = new Logger("ProxyService")

  constructor(
    config: AppConfigService,
    @InjectRepository(ProxyEntry) private proxyRepository: Repository<ProxyEntry>,
    private connection: Connection
  ) {
    const caddy = new CaddyBackend(config);
    this.backends.set(caddy.details().id, caddy);
  }

  private backends: Map<string, ProxyBackendBase> = new Map();

  details(backendId: string) {
    return this.getBackend(backendId).details();
  }

  async isAccessible(backendId: string): Promise<boolean> {
    const backend = this.getBackend(backendId);
    return backend.isAccessible();
  }

  async getManagedEntries(backendId: string): Promise<IProxyEntry[]> {
    // I will read them from database, not from proxy api. Managed entries are stored in db.
    const entries = await this.proxyRepository.find({ backendId });
    // But also reading entries in proxy to check which are active in proxy
    const entriesInProxy = await this.getBackend(backendId).getManagedEntries();

    return entries
      .map(this.entryToEntryDTO)
      .map(entry => {
        const active = entriesInProxy.findIndex(entryPrx => entryPrx.id === entry.id) !== -1;
        return { ...entry, activatedInProxy: active };
      });
  }

  /**
   * Returns proxy entries unmanaged by Dragon Panel
   * 
   * Results can be bugged, don't rely too much on them.
   * I want to return them only to display in UI, modifing them will be impossible.
   * @param backendId 
   */
  async getUnmanagedEntries(backendId: string): Promise<IProxyEntry[]> {
    const entries = await this.getBackend(backendId).getUnmanagedEntries();
    return entries.map(entry => {
      return { ...entry, activatedInProxy: true }
    });
  }

  async getManagedEntryById(backendId: string, id: string): Promise<IProxyEntry> {
    const entry = await this.proxyRepository.findOne(id, { where: { backendId } });
    
    if (entry) {
      const active = await this.getBackend(backendId).entryExists(id);
      const entryDTO = this.entryToEntryDTO(entry);
      entryDTO.activatedInProxy = active;
      return entryDTO;
    }
    throw new EntryNotFoundError(id);
  }

  async addEntry(backendId: string, entryToAdd: IProxyAddEntry): Promise<IProxyEntry> {
    const backend = this.getBackend(backendId);
    const entry = await this.connection.transaction(async manager => {
      // I need first to add it to database, then try to add it to proxy server
      // Because if it would get added to proxy server and then failed while adding to db
      // I would have inconsistent state.
      const entry = backend.createEntry(entryToAdd);
      const entryDb = ProxyEntry.fromProxyEntryDTO(backendId, entry);
      await manager.save(entryDb);
      if (entry.enabled) {
        return await backend.addEntry(entry);
      }
      return entry;
    });
    return entry;
  }

  async deleteEntry(backendId: string, id: string): Promise<void> {
    const backend = this.getBackend(backendId);
    await this.connection.transaction(async manager => {
      await manager.delete(ProxyEntry, { id, backendId });
      await backend.deleteEntry(id);
    });
  }

  async modifyEntry(backendId: string, id: string, entry: IProxyModifyEntry): Promise<IProxyEntry> {
    const backend = this.getBackend(backendId);
    return await this.connection.transaction(async manager => {
      const existingEntry = await manager.findOne(ProxyEntry, { where: { id, backendId } });
      if (!existingEntry) {
        throw new EntryNotFoundError(id);
      }

      const newEntry = { ...this.entryToEntryDTO(existingEntry), entry };
      existingEntry.enabled = newEntry.enabled;
      existingEntry.matcher = newEntry.matcher;
      existingEntry.upstreams = newEntry.upstreams;
      await manager.save(existingEntry);

      if (await backend.entryExists(id)) {
        if (newEntry.enabled) {
          await backend.modifyEntry(id, newEntry);
        }
        else {
          await backend.deleteEntry(id);
        }
      }
      else if (newEntry.enabled) {
        await backend.addEntry(newEntry);
      }
      newEntry.activatedInProxy = newEntry.enabled; // Should be correct. Should... xD
      return newEntry;
    });
  }

  async fullSync(backendId: string) {
    try {
      this.logger.log(`fullSync: Starting synchronization with proxy for ${backendId}`);
      const backend = this.getBackend(backendId);
  
      const entries = await this.proxyRepository.find({ backendId, enabled: true });
      const entriesInProxy = await backend.getManagedEntries();
      
      this.logger.log(`fullSync: Deleting entries from ${backendId}...`);
  
      await Promise.all(entriesInProxy.map(entry => {
        return backend.deleteEntry(entry.id);
      }));
  
      this.logger.log(`fullSync: Deleted entries from ${backendId}.`);
      this.logger.log(`fullSync: Adding entries to ${backendId}...`);
  
      await Promise.all(entries.map(async entry => {
        return backend.addEntry(entry);
      }));
  
      this.logger.log(`fullSync: Added entries to ${backendId}.`);
      this.logger.log(`fullSync: Synchronization completed successfully.`);
    }
    catch (err) {
      this.logger.error(`fullSync: [FATAL ERROR]: Synchronization failed with error ${inspect(err)}.`);
      this.logger.error(`fullSync: [FATAL ERROR]: Synchronization failed, proxy now is unstable, try again or restart proxy server and then try again.`);
      throw err;
    }
  }

  availableBackends() {
    return Array.from(this.backends.keys());
  }

  private getBackend(backendId: string): ProxyBackendBase {
    if (this.backends.has(backendId)) {
      return this.backends.get(backendId);
    }
    throw new BackendNotSupportedError(backendId);
  }

  private entryToEntryDTO({ id, matcher, upstreams, enabled}: ProxyEntry): IProxyEntry {
    return { id, matcher, upstreams, enabled }
  }
}
