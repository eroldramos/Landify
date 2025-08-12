import type { AuthStore } from "@/types/schema";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AppStore = {
  search: string;
  setSearch: (value: string) => void;
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
}));
