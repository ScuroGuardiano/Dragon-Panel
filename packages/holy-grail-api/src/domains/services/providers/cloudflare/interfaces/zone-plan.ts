export default interface CF_ZonePlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  frequency: string;
  legacy_id: string;
  is_subscribed: boolean;
  can_subscribe: boolean;
}
