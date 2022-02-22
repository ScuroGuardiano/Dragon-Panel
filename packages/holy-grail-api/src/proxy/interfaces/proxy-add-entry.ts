export default interface IProxyAddEntry {
  matcher: string;
  upstreams: string[];
  enabled: boolean;
}
