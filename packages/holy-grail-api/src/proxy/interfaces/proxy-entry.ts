export default interface IProxyEntry {
  id: string;
  matcher: string;
  to: string;
  enabled: boolean;
  url?: string;
}
