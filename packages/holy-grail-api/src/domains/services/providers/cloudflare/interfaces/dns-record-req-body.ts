export interface CF_DNSRecordCreate {
  type: string;
  name: string;
  content: string;
  ttl: number;
  priority?: number;
  proxied?: boolean;
}

export interface CF_DNSRecordUpdate {
  type: string;
  name: string;
  content: string;
  ttl: number;
  proxied?: boolean;
}

export interface CF_DNSRecordPatch {
  type?: string;
  name?: string;
  content?: string;
  ttl?: number;
  proxied?: boolean;
}
