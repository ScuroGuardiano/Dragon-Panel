import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";
import { IDNSRecordCreate } from "../services/interfaces/dns-record-req-body";

export default class CreateDNSRecordDTO implements IDNSRecordCreate {
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
