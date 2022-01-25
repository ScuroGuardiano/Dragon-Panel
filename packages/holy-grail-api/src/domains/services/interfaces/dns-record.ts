export default interface IDNSRecord {
  id: string;
  name: string;
  content: string;
  type: string;
  ttl: number;
  proxied?: boolean;
  proxiable?: boolean;
}
