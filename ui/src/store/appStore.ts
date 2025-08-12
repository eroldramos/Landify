import type { AuthStore } from "@/types/schema";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
