import { Column, Entity, PrimaryColumn } from "typeorm";
import IProxyEntry from "../interfaces/proxy-entry";

@Entity()
export default class ProxyEntry {
  @PrimaryColumn()
  id: string;

  @Column()
  backendId: string;

  @Column()
  matcher: string;

  @Column({ type: 'text', name: 'upstreams' })
  private _upstreams: string;

  get upstreams(): string[] {
    return JSON.parse(this._upstreams);
  }

  set upstreams(v: string[]) {
    this._upstreams = JSON.stringify(v);
  }

  @Column({ default: true })
  enabled: boolean;

  static fromProxyEntryDTO(backendId: string, entryDto: IProxyEntry): ProxyEntry {
    const entry = new ProxyEntry();
    entry.id = entryDto.id;
    entry.matcher = entryDto.matcher;
    entry.upstreams = entryDto.upstreams;
    entry.enabled = entryDto.enabled;
    entry.backendId = backendId;
    return entry;
  }
}
