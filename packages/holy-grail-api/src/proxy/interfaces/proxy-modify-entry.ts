export default interface IProxyModifyEntry {
  matcher?: string;
  upstreams?: string[];
  enabled?: boolean;
}
