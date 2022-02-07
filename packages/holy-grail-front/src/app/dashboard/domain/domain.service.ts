import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDNSRecordCreate } from './interfaces/dns-dtos';
import IDNSRecord from './interfaces/dns-record';
import IDomain from './interfaces/domain';

@Injectable({
  providedIn: 'root'
})
export class DomainService {

  constructor(private httpClient: HttpClient) { }

  private supportedRecordTypes = ['A', 'AAAA', 'CNAME'];

  private domains: IDomain[] = [];

  async getDomainList(): Promise<IDomain[]> {
    if (this.domains.length > 0) {
      return this.domains;
    }
    this.domains = await this.httpClient.get<IDomain[]>('/api/domains').toPromise();
    return this.domains;
  }

  async getDomainNameById(id: string): Promise<string> {
    if (this.domains.length === 0) {
      await this.getDomainList();
    }
    const domain = this.domains.find(d => d.id === id);
    return domain?.name ?? '';
  }

  async getDNSRecords(domainId: string): Promise<IDNSRecord[]> {
    const records = await this.httpClient.get<IDNSRecord[]>(`/api/domains/${domainId}`).toPromise();
    return records.filter(record => this.supportedRecordTypes.includes(record.type));
  }

  async deleteDNSRecord(domainId: string, recordId: string): Promise<void> {
    await this.httpClient.delete<void>(`/api/domains/${domainId}/${recordId}`).toPromise();
  }

  async addDNSRecord(domainId: string, record: IDNSRecordCreate): Promise<IDNSRecord> {
    return this.httpClient.post<IDNSRecord>(`/api/domains/${domainId}`, record).toPromise();
  }
}
