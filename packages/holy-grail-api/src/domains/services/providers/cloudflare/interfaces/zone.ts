import IAccount from "./account";
import IZoneOwner from "./zone-owner";
import IZonePlan from "./zone-plan";

export default interface CF_Zone {
  plan_pending: IZonePlan;
  original_dnshost?:string;
  permissions: string[];
  development_mode: number;
  plan: IZonePlan;
  original_name_servers?: string[];
  name: string;
  account: IAccount;
  activated_on?: string;
  paused: boolean;
  status: string;
  owner: IZoneOwner;
  modified_on: string;
  created_on: string;
  type: string;
  id: string;
  name_servers: string[];
  original_registrar?: string;
}
