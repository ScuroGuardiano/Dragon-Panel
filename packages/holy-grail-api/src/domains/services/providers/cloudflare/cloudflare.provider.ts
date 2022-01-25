import { ProviderBase } from '../provider-base';
import fetch from 'cross-fetch';
import InvalidApiTokenException from '../errors/invalid-api-token';
import ProviderReturned5xxException from '../errors/provider-returned-5xx';
import IDomain from '../../interfaces/domain';
import CloudflareResponse from './interfaces/cf-response';
import CF_Zone from './interfaces/zone';
import IDNSRecord from '../../interfaces/dns-record';
import CF_DNSRecord from './interfaces/dns-record';
import { IDNSRecordCreate, IDNSRecordPatch, IDNSRecordUpdate } from '../../interfaces/dns-record-req-body';
import { CF_DNSRecordCreate, CF_DNSRecordPatch, CF_DNSRecordUpdate } from './interfaces/dns-record-req-body';

/****************************************************
 *                      TODO                        *
 *              Add Error Handling <3               *
 *                      TODO                        *
 ****************************************************/

export default class CloudflareProvider extends ProviderBase {
  async canConnect(): Promise<boolean> {
    const response = await this.get('https://api.cloudflare.com/client/v4/user/tokens/verify');
    
    if (response.status === 400) {
      // Invalid length of API Token results in 400 error instead of 401
      // Only in verify method I will throw InvalidApiTokenException on 400 response
      throw new InvalidApiTokenException("CLOUDFLARE");
    }

    return true;
  }

  async listDomains(): Promise<IDomain[]> {
    const response = await this.get('https://api.cloudflare.com/client/v4/zones');
    if (response.status !== 200) {
      console.error(response);
      throw new Error("CF returned error non 200 response while listing domains");
    }
    const { result: zones } = await response.json() as CloudflareResponse<CF_Zone[]>;
    return zones.filter(zone => zone.status === "active").map(zone => {
      return {
        id: zone.id,
        name: zone.name
      }
    });
  }

  async listDNSRecords(domainId: string): Promise<IDNSRecord[]> {
    const response = await this.get(`https://api.cloudflare.com/client/v4/zones/${domainId}/dns_records`);
    if (response.status !== 200) {
      console.error(response);
      throw new Error("CF returned error non 200 response while listing DNS Records");
    }

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
      const response = await this.post<CF_DNSRecordCreate>(`https://api.cloudflare.com/client/v4/zones/${domainId}/dns_records`, {
        ...record
      });

      if (response.ok) {
        console.error(response);
        throw new Error("CF returned error non OK Response while creating DNS Record");
      }

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
      const response = await this.put<CF_DNSRecordUpdate>(`https://api.cloudflare.com/client/v4/zones/${domainId}/dns_records/${recordId}`, {
        ...record
      });

      if (response.ok) {
        console.error(response);
        throw new Error("CF returned error non OK Response while updating DNS Record");
      }

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
    const response = await this.patch<CF_DNSRecordPatch>(`https://api.cloudflare.com/client/v4/zones/${domainId}/dns_records/${recordId}`, {
      ...record
    });

    if (response.ok) {
      console.error(response);
      throw new Error("CF returned error non OK Response while patching DNS Record");
    }

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
    const response = await this.delete(`https://api.cloudflare.com/client/v4/zones/${domainId}/dns_records/${recordId}`);

    if (response.ok) {
      console.error(response);
      throw new Error("CF returned error non OK Response while deleting DNS Record");
    }

    return true;
  }

  private async get(url: string): Promise<Response> {
    return this.requestWithoutBody(url, "GET");
  }

  private async delete(url: string): Promise<Response> {
    return this.requestWithoutBody(url, "DELETE");
  }

  private async post<T>(url: string, body: T) {
    return this.requestWithBody(url, "POST", body);
  }

  private async put<T>(url: string, body: T) {
    return this.requestWithBody(url, "PUT", body);
  }

  private async patch<T>(url: string, body: T) {
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

    this.verifyResponse(res);

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

    this.verifyResponse(res);

    return res;
  }

  private verifyResponse(res: Response) {
    if (res.status === 401) {
      throw new InvalidApiTokenException("CLOUDFLARE");
    }

    if (res.status >= 500 && res.status <= 599) {
      throw new ProviderReturned5xxException("CLOUDFLARE", res.status);
    }
  } 
}
