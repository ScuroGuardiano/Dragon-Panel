import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";
import { IDNSRecordUpdate } from "../services/interfaces/dns-record-req-body";

export default class UpdateDNSRecordDTO implements IDNSRecordUpdate {
  @IsString()
  type: string;

  @IsInt()
  ttl: number;

  @IsString()
  content: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  proxied?: boolean;
}
