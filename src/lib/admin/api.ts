import { createClient } from "@/lib/supabase/client";
import {
  normalizeRestaurant,
  type Category,
  type CategoryInsert,
  type GalleryInsert,
  type GalleryRow,
  type MenuItemInsert,
  type MenuItemRow,
  type Restaurant,
} from "@/lib/types";

const BUCKET = "menu-images";

/* ----------------------------- Storage ----------------------------- */

/** Upload a file to the public menu-images bucket and return its public URL. */
export async function uploadImage(file: File, folder = "menu"): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/* --------------------------- Menu items ---------------------------- */

export async function fetchMenuItems(): Promise<MenuItemRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function saveMenuItem(
  values: MenuItemInsert & { id?: string }
): Promise<void> {
  const supabase = createClient();
  const { id, ...rest } = values;
  const payload = { ...rest, updated_at: new Date().toISOString() };
  if (id) {
    const { error } = await supabase.from("menu_items").update(payload).eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("menu_items").insert(payload);
    if (error) throw error;
  }
}

export async function deleteMenuItems(ids: string[]): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("menu_items").delete().in("id", ids);
  if (error) throw error;
}

export async function toggleMenuAvailability(id: string, available: boolean): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("menu_items")
    .update({ available, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

/** Persist a new manual order by writing each item's sort_order. */
export async function reorderMenuItems(
  order: { id: string; sort_order: number }[]
): Promise<void> {
  if (order.length === 0) return;
  const supabase = createClient();
  const ts = new Date().toISOString();
  const results = await Promise.all(
    order.map(({ id, sort_order }) =>
      supabase.from("menu_items").update({ sort_order, updated_at: ts }).eq("id", id)
    )
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) throw failed.error;
}

/* ---------------------------- Categories --------------------------- */

export async function fetchCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function saveCategory(values: CategoryInsert & { id?: string }): Promise<void> {
  const supabase = createClient();
  const { id, ...rest } = values;
  if (id) {
    const { error } = await supabase.from("categories").update(rest).eq("id", id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("categories").insert(rest);
    if (error) throw error;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

/* ----------------------------- Gallery ----------------------------- */

export async function fetchGallery(): Promise<GalleryRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function addGalleryImage(values: GalleryInsert): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("gallery").insert(values);
  if (error) throw error;
}

export async function deleteGalleryImage(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("gallery").delete().eq("id", id);
  if (error) throw error;
}

/* --------------------------- Restaurant ---------------------------- */

export async function fetchRestaurant(): Promise<Restaurant | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("restaurant_info")
    .select("*")
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? normalizeRestaurant(data) : null;
}

export async function saveRestaurant(id: string, values: Partial<Restaurant>): Promise<void> {
  const supabase = createClient();
  const { hours, socials, branches, ...rest } = values;
  const payload = {
    ...rest,
    ...(hours !== undefined ? { hours } : {}),
    ...(socials !== undefined ? { socials } : {}),
    ...(branches !== undefined ? { branches } : {}),
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabase
    .from("restaurant_info")
    .update(payload as never)
    .eq("id", id);
  if (error) throw error;
}
