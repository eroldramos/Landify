import type { AuthStore, ListingStatus, PropertyType } from "@/types/schema";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type FilterState = {
  propertyType: PropertyType | "";
  status: ListingStatus | "";
  priceRange: number[];
};

export type AppStore = {
  search: string;
  setSearch: (value: string) => void;
  filters: FilterState;
  setFilters: (value: FilterState) => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      auth: null,
      setAuth: (value) => set({ auth: value }),
    }),
    {
      name: "auth-details",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const useAppStore = create<AppStore>((set) => ({
  search: "",
  setSearch: (value) => set({ search: value }),

  filters: {
    propertyType: "",
    status: "",
    priceRange: [0, 50],
  },
  setFilters: (value) => set({ filters: value }),
}));
