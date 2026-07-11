import type { Database } from "./database.types";

export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type MenuItemRow = Database["public"]["Tables"]["menu_items"]["Row"];
export type GalleryRow = Database["public"]["Tables"]["gallery"]["Row"];
export type RestaurantRow = Database["public"]["Tables"]["restaurant_info"]["Row"];

export type MenuItemInsert = Database["public"]["Tables"]["menu_items"]["Insert"];
export type MenuItemUpdate = Database["public"]["Tables"]["menu_items"]["Update"];
export type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];
export type CategoryUpdate = Database["public"]["Tables"]["categories"]["Update"];
export type GalleryInsert = Database["public"]["Tables"]["gallery"]["Insert"];

/** A menu item joined with its category slug/label for convenience. */
export type MenuItem = MenuItemRow & {
  category_slug: string | null;
  category_label: string | null;
};

/** Shapes stored inside restaurant_info jsonb columns. */
export type OpeningHour = { day: string; time: string };
export type Branch = { name: string; phone?: string; address?: string; map?: string };
export type Socials = {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  whatsapp?: string;
};

export type Restaurant = Omit<RestaurantRow, "hours" | "socials" | "branches"> & {
  hours: OpeningHour[];
  socials: Socials;
  branches: Branch[];
};

export function normalizeRestaurant(row: RestaurantRow): Restaurant {
  return {
    ...row,
    hours: (Array.isArray(row.hours) ? row.hours : []) as OpeningHour[],
    socials: (row.socials && typeof row.socials === "object" ? row.socials : {}) as Socials,
    branches: (Array.isArray(row.branches) ? row.branches : []) as Branch[],
  };
}
