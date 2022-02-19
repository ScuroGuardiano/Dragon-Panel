import { AppConfigService } from "src/app-config/app-config.service";
import IProxyAddEntry from "../interfaces/proxy-add-entry";
import IProxyBackend from "../interfaces/proxy-backend";
import IProxyEntry from "../interfaces/proxy-entry";
import IProxyModifyEntry from "../interfaces/proxy-modify-entry";

export default abstract class ProxyBackendBase {
  constructor(protected config: AppConfigService) {}

  abstract isAccessible(): Promise<boolean>;
  abstract getEntries(): Promise<IProxyEntry[]>;
  abstract details(): IProxyBackend;
  abstract addEntry(entry: IProxyAddEntry): Promise<IProxyEntry>;
  // Throw for error uwu
  abstract deleteEntry(id: string): Promise<void>;
  abstract modifyEntry(id: string, entry: IProxyModifyEntry): Promise<IProxyEntry>;
}
