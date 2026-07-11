import { create } from "zustand";
import type { MenuItem } from "@/lib/types";

export type SortKey = "featured" | "price-asc" | "price-desc" | "name" | "newest";

type MenuState = {
  query: string;
  category: string; // "all" or a category slug
  sort: SortKey;
  onlyAvailable: boolean;
  onlyVeg: boolean;
  selected: MenuItem | null;

  setQuery: (q: string) => void;
  setCategory: (c: string) => void;
  setSort: (s: SortKey) => void;
  toggleAvailable: () => void;
  toggleVeg: () => void;
  select: (item: MenuItem | null) => void;
  reset: () => void;
};

export const useMenuStore = create<MenuState>((set) => ({
  query: "",
  category: "all",
  sort: "featured",
  onlyAvailable: false,
  onlyVeg: false,
  selected: null,

  setQuery: (query) => set({ query }),
  setCategory: (category) => set({ category }),
  setSort: (sort) => set({ sort }),
  toggleAvailable: () => set((s) => ({ onlyAvailable: !s.onlyAvailable })),
  toggleVeg: () => set((s) => ({ onlyVeg: !s.onlyVeg })),
  select: (selected) => set({ selected }),
  reset: () =>
    set({ query: "", category: "all", sort: "featured", onlyAvailable: false, onlyVeg: false }),
}));
