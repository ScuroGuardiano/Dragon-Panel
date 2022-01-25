import { AppConfigService } from 'src/app-config/app-config.service';
import IDNSRecord from '../interfaces/dns-record';
import { IDNSRecordCreate, IDNSRecordPatch, IDNSRecordUpdate } from '../interfaces/dns-record-req-body';
import IDomain from '../interfaces/domain';

export abstract class ProviderBase {
  constructor(protected appConfigService: AppConfigService) {}
  abstract canConnect(): Promise<boolean>;
  abstract listDomains(): Promise<IDomain[]>;
  abstract listDNSRecords(domainId: string): Promise<IDNSRecord[]>;
  abstract createDNSRecord(domainId: string, record: IDNSRecordCreate): Promise<IDNSRecord>;
  abstract updateDNSRecord(domainId: string, recordId: string, record: IDNSRecordUpdate): Promise<IDNSRecord>;
  abstract patchDNSRecord(domainId: string, recordId: string, record: IDNSRecordPatch): Promise<IDNSRecord>;
  abstract deleteDNSRecord(domainId: string, recordId: string): Promise<boolean>;
}
