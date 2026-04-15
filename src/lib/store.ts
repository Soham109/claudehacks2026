import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  lat: number | null;
  lng: number | null;
  addressLabel: string;
  setLocation: (lat: number, lng: number, label: string) => void;
  clear: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      lat: null,
      lng: null,
      addressLabel: "",
      setLocation: (lat, lng, label) => set({ lat, lng, addressLabel: label }),
      clear: () => set({ lat: null, lng: null, addressLabel: "" }),
    }),
    { name: "connectable-local" }
  )
);
