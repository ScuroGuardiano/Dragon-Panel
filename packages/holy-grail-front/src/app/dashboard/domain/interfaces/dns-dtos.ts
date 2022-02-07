export interface IDNSRecordCreate {
  type: string;
  ttl: number;
  content: string;
  name: string;
  proxied?: boolean;
}
