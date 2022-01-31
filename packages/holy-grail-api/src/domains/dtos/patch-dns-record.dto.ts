import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

export default class PatchDNSRecordDTO {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsInt()
  ttl?: number;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  proxied?: boolean;
}
