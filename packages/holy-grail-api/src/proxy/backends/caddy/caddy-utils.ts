import { Logger } from "@nestjs/common";
import { inspect } from "util";
import { CaddyReverseProxyHandle, CaddyRoute, CaddyRouteMatch, CaddyServers, CaddySubrouteHandle } from "./caddy-interfaces";

export enum CaddyHandlerType {
  SUBROUTE = "subroute",
  REVERSE_PROXY = "reverse_proxy"
}

export interface ICaddyReverseProxyEntry {
  server?: string;
  match: string;
  upstreams: string[];
}

// TODO: make method for finding proxy entries managed by Dragon Panel. I will use @id for it.

export default class CaddyUtils {
  logger = new Logger("Caddy Utils");

  /**
   * Flattens caddy servers config
   * 
   * @see {@link CaddyUtils.parseRoute}
   * @param servers 
   * @returns 
   */
  proxyEntriesFromServers(servers: CaddyServers): ICaddyReverseProxyEntry[] {
    const entries = [] as ICaddyReverseProxyEntry[];

    Object.keys(servers).forEach(serverName => {
      const server = servers[serverName];
      server.routes.forEach(route => {
        try {
          entries.push(...this.parseRoute(route).map(entry => {
            return { ...entry, server: serverName }
          }));
        }
        catch(err) {
          this.logger.error(`Error while parsing route ${inspect(route)}`);
          this.logger.error(err);
        }
      });
    });

    return entries;
  }

  /**
   * Parses route and returns flat proxy entries list.
   * 
   * Little word about how I am parsing it, but first of all we must learn the structure of caddy config.  
   * Rules:
   * - Each route can have multiple handlers
   * - Each route can have multiple matches or non at all
   * - Handler can be subroute, which contains routes...
   * - Subroutes can have of course they're own path matches, I must concat them
   * - Handler can be reverse_proxy, reverse_proxy can have multiple upstreams
   * 
   * We have clearly here some wicked relation: Many matches to many handlers to many upstreams  
   * I had to flatten it somehow, I decided for relation Match -> handler -> upstreams.  
   * Some of outcomes of this:
   * - If one route has 3 matches - three entries will be outputted
   * - If one route has 3 matches and it's subroute got 2 matches - six entries will be outputted
   * - If one route has 2 matches and 2 handlers - four entries will be outputted
   * - If one route has 2 matches, 2 handlers and each got 3 upstreams - four entries will be outputted - with 3 upstreams in each
   * 
   * I could've done this better, like Matches -> Upstreams. But the problems are
   * 1. I don't know caddy too well to try flatten it better, I tried only on simple configs.
   * 2. Entries managed by Dragon Panel will be simpler. This is only that complicated because I want to show also entries from Caddyfiles.
   *    So I don't want to waste too much time on parsing config from Caddyfiles. Changing anything contained in Caddyfiles will be not
   *    allowed in the Dragon Panel.
   * 3. Flattening it in that way can be really hard.
   * 
   * So future me or anyone else reading this source, better leave it alone. At least for now.
   * 
   * @param route 
   * @param matches 
   * @returns 
   */
  parseRoute(route: CaddyRoute, matches: string[] = []): ICaddyReverseProxyEntry[] {
    const _matches = [] as string[]; // We need our local array for that

    if (matches.length === 0) {
      // If there're no matches we can push them
      route.match?.forEach(match => _matches.push(this.joinMatch(match)));
    } else if(route.match && route.match.length > 0) {
      // If there are matches and route matches we must append every match from route to them
      // Yea, it's fucking n*m complexity
      route.match?.forEach(routeMatch => {
        matches.forEach(match => _matches.push(match + this.joinMatch(routeMatch)));
      });
    } else {
      // Otherwise we will just copy matches from arguments
      _matches.push(...matches);
    }
    // Now when we have matches for our upstreams we can start searching for reverse_proxy handlers
    // To get upstreams

    const entries: ICaddyReverseProxyEntry[] = [];
    route.handle.forEach(handle => {
      if (handle.handler === CaddyHandlerType.REVERSE_PROXY) {
        const reverseProxyHandle = handle as CaddyReverseProxyHandle;
        // For each match we will push upstreams
        _matches.forEach(match => {
          entries.push({
            match,
            upstreams: reverseProxyHandle.upstreams.map(upstream => upstream.dial)
          });
        });
      }
      if (handle.handler === CaddyHandlerType.SUBROUTE) {
        // If it's subroute then we will do recursion ^^
        const subrouteHandle = handle as CaddySubrouteHandle;
        subrouteHandle.routes.forEach(route => {
          const subrouteEntries = this.parseRoute(route, _matches);
          entries.push(...subrouteEntries);
        });
      }
    });

    return entries;
  }

  private joinMatch(match: CaddyRouteMatch): string {
    return (match.host?.join('') ?? '') + (match.path?.join('') ?? '');
  }
}
