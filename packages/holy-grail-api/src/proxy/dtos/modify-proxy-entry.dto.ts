import { IsBoolean, IsOptional, IsString } from "class-validator";
import IProxyModifyEntry from "../interfaces/proxy-modify-entry";

export default class ModifyProxyEntryDTO implements IProxyModifyEntry {
  @IsOptional()
  @IsString()
  matcher?: string;

  @IsOptional()
  @IsString({ each: true })
  upstreams?: string[];

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
