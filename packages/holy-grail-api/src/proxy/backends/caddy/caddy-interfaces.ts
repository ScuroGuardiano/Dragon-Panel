// Caddy allows us to put @id in objects to easily find them. I will use it ofc <3
export interface CaddyType {
  '@id'?: string;
}


// https://<api>/config/apps/http/servers
export interface CaddyServers {
  [key: string]: CaddyServer;
}

export interface CaddyServer extends CaddyType {
  listen: string[];
  routes: CaddyRoute[];
}

export interface CaddyRoute extends CaddyType {
  handle: CaddyRouteHandle[];
  match?: CaddyRouteMatch[];
  terminal?: boolean;
}

export interface CaddyRouteHandle extends CaddyType {
  handler: string;
}

export interface CaddySubrouteHandle extends CaddyRouteHandle {
  handler: "subroute";
  routes: CaddyRoute[];
}

export interface CaddyReverseProxyHandle extends CaddyRouteHandle {
  handler: "reverse_proxy";
  upstreams: CaddyUpstream[];
}

export interface CaddyRouteMatch extends CaddyType {
  host?: string[]
  path?: string[]
}

export interface CaddyUpstream extends CaddyType {
  dial: string;
}

export interface CaddyManagedProxyRoute {
  '@id': string;
  handle: {
    handler: "subroute"
    routes: {
      handle: {
        handler: "reverse_proxy",
        upstreams: {
          dial: string
        }[]
      }[]
    }[]
  }[],
  match: CaddyRouteMatch[],
  terminal: true
}
