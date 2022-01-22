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
