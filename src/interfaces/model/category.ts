export type CategoryStatus = "active" | "hidden";

export type CategoryVariant =
  | "blue"
  | "pink"
  | "teal"
  | "gold"
  | "green"
  | "purple";

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  emoji?: string;
  variant?: CategoryVariant;
  order?: number;
  status: CategoryStatus;
  created_at: string;
  updated_at: string;
}
