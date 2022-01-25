export interface IDNSRecordCreate {
  type: string;
  ttl: number;
  content: string;
  name: string;
  proxied?: boolean;
}

export interface IDNSRecordUpdate {
  type: string;
  ttl: number;
  content: string;
  name: string;
  proxied?: boolean;
}

export interface IDNSRecordPatch {
  type?: string;
  ttl?: number;
  content?: string;
  name?: string;
  proxied?: boolean;
}
