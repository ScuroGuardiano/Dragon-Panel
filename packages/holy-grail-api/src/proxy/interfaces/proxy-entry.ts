export default interface IProxyEntry {
  id: string;
  matcher: string;
  upstreams: string[];
  enabled: boolean;
  url?: string;
  activatedInProxy?: boolean;
}
