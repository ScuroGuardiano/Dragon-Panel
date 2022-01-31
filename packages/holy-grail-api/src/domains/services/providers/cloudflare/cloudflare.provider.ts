import { ProviderBase } from '../provider-base';
import IDomain from '../../interfaces/domain';
import CloudflareResponse from './interfaces/cf-response';
import CF_Zone from './interfaces/zone';
import IDNSRecord from '../../interfaces/dns-record';
import CF_DNSRecord from './interfaces/dns-record';
import { IDNSRecordCreate, IDNSRecordPatch, IDNSRecordUpdate } from '../../interfaces/dns-record-req-body';
import { CF_DNSRecordCreate, CF_DNSRecordPatch, CF_DNSRecordUpdate } from './interfaces/dns-record-req-body';
import CloudflareHttpClient from './cloudflare-http-client';
import CloudflareErrorHandler from './cloudflare-error-handler';

export default class CloudflareProvider extends ProviderBase {
  private http = new CloudflareHttpClient(this.appConfigService);
  private errorHandler = new CloudflareErrorHandler();

  get name() {
    return "CLOUDFLARE";
  }

  async canConnect(): Promise<boolean> {
    const response = await this.http.get('https://api.cloudflare.com/client/v4/user/tokens/verify');
    return await this.verifyResponse(response);
  }

  async listDomains(): Promise<IDomain[]> {
    const response = await this.http.get('https://api.cloudflare.com/client/v4/zones');
    await this.verifyResponse(response);

    const { result: zones } = await response.json() as CloudflareResponse<CF_Zone[]>;
    return zones.filter(zone => zone.status === "active").map(zone => {
      return {
        id: zone.id,
        name: zone.name
      }
    });
  }

  async listDNSRecords(domainId: string): Promise<IDNSRecord[]> {
    const response = await this.http.get(`https://api.cloudflare.com/client/v4/zones/${domainId}/dns_records`);
    await this.verifyResponse(response);

    const { result: records } = await response.json() as CloudflareResponse<CF_DNSRecord[]>;

    return records.map(record => {
      return {
        name: record.name,
        id: record.id,
        type: record.type,
        content: record.content,
        ttl: record.ttl,
        proxied: record.proxied,
        proxiable: record.proxiable
      }
    });
  }

  async createDNSRecord(domainId: string, record: IDNSRecordCreate): Promise<IDNSRecord> {
      const response = await this.http.post<CF_DNSRecordCreate>(`https://api.cloudflare.com/client/v4/zones/${domainId}/dns_records`, {
        ...record
      });
      await this.verifyResponse(response);

      const { result: createdRecord } = await response.json() as CloudflareResponse<CF_DNSRecord>;
      return {
        type: createdRecord.type,
        name: createdRecord.name,
        id: createdRecord.name,
        ttl: createdRecord.ttl,
        content: createdRecord.content,
        proxiable: createdRecord.proxiable,
        proxied: createdRecord.proxied
      }
  }

  async updateDNSRecord(domainId: string, recordId: string, record: IDNSRecordUpdate): Promise<IDNSRecord> {
      const response = await this.http.put<CF_DNSRecordUpdate>(`https://api.cloudflare.com/client/v4/zones/${domainId}/dns_records/${recordId}`, {
        ...record
      });
      await this.verifyResponse(response);

      const { result: createdRecord } = await response.json() as CloudflareResponse<CF_DNSRecord>;
      return {
        type: createdRecord.type,
        name: createdRecord.name,
        id: createdRecord.name,
        ttl: createdRecord.ttl,
        content: createdRecord.content,
        proxiable: createdRecord.proxiable,
        proxied: createdRecord.proxied
      }
  }

  async patchDNSRecord(domainId: string, recordId: string, record: IDNSRecordPatch): Promise<IDNSRecord> {
    const response = await this.http.patch<CF_DNSRecordPatch>(`https://api.cloudflare.com/client/v4/zones/${domainId}/dns_records/${recordId}`, {
      ...record
    });
    await this.verifyResponse(response);

    const { result: createdRecord } = await response.json() as CloudflareResponse<CF_DNSRecord>;
    return {
      type: createdRecord.type,
      name: createdRecord.name,
      id: createdRecord.name,
      ttl: createdRecord.ttl,
      content: createdRecord.content,
      proxiable: createdRecord.proxiable,
      proxied: createdRecord.proxied
    }
  }

  async deleteDNSRecord(domainId: string, recordId: string): Promise<boolean> {
    const response = await this.http.delete(`https://api.cloudflare.com/client/v4/zones/${domainId}/dns_records/${recordId}`);
    await this.verifyResponse(response);

    return true;
  }
  
  private async verifyResponse(response: Response) {
    if (response.ok) {
      return true;
    }
    else {
      await this.errorHandler.handleErrorResponse(response);
      return false; // In fact this should never return, coz handle error response
      // Should always throw ^^
    }
  }
}
