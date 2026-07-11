import { createClient } from "@/lib/supabase/server";
import {
  normalizeRestaurant,
  type Category,
  type GalleryRow,
  type MenuItem,
  type Restaurant,
} from "@/lib/types";

/** All categories ordered for display. */
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/** All menu items joined with their category slug + label. */
export async function getMenuItems(): Promise<MenuItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select("*, categories(slug, label)")
    .order("sort_order", { ascending: true });
  if (error) throw error;

  return (data ?? []).map((row) => {
    const { categories, ...item } = row as typeof row & {
      categories: { slug: string; label: string } | null;
    };
    return {
      ...item,
      category_slug: categories?.slug ?? null,
      category_label: categories?.label ?? null,
    } as MenuItem;
  });
}

/** Gallery images ordered for display. */
export async function getGallery(): Promise<GalleryRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/** Singleton restaurant/site settings row. */
export async function getRestaurant(): Promise<Restaurant | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("restaurant_info")
    .select("*")
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? normalizeRestaurant(data) : null;
}
