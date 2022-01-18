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

export const appConfigSchema: IAppConfigSchema = {
    "INITIAL_SETUP": {
        description: "Whether the app has been setup or not",
        default: "false",
        type: "boolean",
        allowedValues: ["true", "false"],
        readable: true,
        writable: false
    },
    "CF_API_KEY": {
        description: "Cloudflare API key",
        type: "string",
        encrypted: true,
        readable: false,
        writable: true
    },
    "PROXMOX_API_KEY": {
        description: "Proxmox API key",
        type: "string",
        encrypted: true,
        readable: false,
        writable: true
    },
    "PROXMOX_API_URL": {
        description: "Proxmox API URL",
        type: "string",
        encrypted: false,
        readable: true,
        writable: true
    },
    "CADDY_ADMIN_API": {
        description: "Caddy web server admin api url",
        type: "string",
        encrypted: false,
        readable: true,
        writable: true
    },
    "CADDY_USERNAME": {
        description: "Caddy username",
        type: "string",
        encrypted: false,
        readable: true,
        writable: true
    },
    "CADDY_PASSWORD": {
        description: "Caddy password",
        type: "string",
        encrypted: true,
        readable: false,
        writable: true
    },
    "PORTAINER_API": {
        description: "Portainer API url",
        type: "string",
        encrypted: false,
        readable: true,
        writable: true
    },
    "PORTAINER_USERNAME": {
        description: "Portainer username",
        type: "string",
        encrypted: false,
        readable: true,
        writable: true
    },
    "PORTAINER_PASSWORD": {
        description: "Portainer password",
        type: "string",
        encrypted: true,
        readable: false,
        writable: true
    }
}

export interface IAppConfig {
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
