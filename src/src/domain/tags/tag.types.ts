export type TagCategory = "condition" | "activity" | "other";

export type TagId =
  | "outdoor"
  | "indoor"
  | "summer"
  | "winter"
  | "extreme_heat"
  | "cold"
  | "rain"
  | "night"
  | "morning"
  | "intense"
  | "combat"
  | "strength"
  | "swimming"
  | "running"
  | "walking"
  | "route"
  | "finance"
  | "challenge"
  | "personal_record"
  | "rival"
  | "manual";

export interface TagDefinition {
  id: TagId;
  label: string;
  category: TagCategory;
  description?: string;
}
