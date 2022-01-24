export interface IAppConfigSchemaEntry {
  encrypted?: boolean;
  description?: string;
  default?: string;
  type?: string;
  allowedValues?: string[];
  readable: boolean;
  writable: boolean;
}

export interface IAppConfigSchema {
  [key: string]: IAppConfigSchemaEntry;
}

export interface IAppConfig {
  [key: string]: string | undefined;
  INITIAL_SETUP?: string;
  CF_API_KEY?: string;
  PROXMOX_API_KEY?: string;
  PROXMOX_API_URL?: string;
  CADDY_ADMIN_API?: string;
  CADDY_USERNAME?: string;
  CADDY_PASSWORD?: string;
  PORTAINER_API?: string;
  PORTAINER_USERNAME?: string;
  PORTAINER_PASSWORD?: string;
}
