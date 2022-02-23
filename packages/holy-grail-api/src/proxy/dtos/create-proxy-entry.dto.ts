import { ArrayNotEmpty, IsBoolean, IsOptional, IsString } from "class-validator";
import IProxyAddEntry from "../interfaces/proxy-add-entry";

export default class CreateProxyEntryDTO implements IProxyAddEntry {
  @IsString()
  matcher: string;

  @IsString({ each: true })
  @ArrayNotEmpty()
  upstreams: string[];

  @IsBoolean()
  @IsOptional()
  enabled: boolean;
}
