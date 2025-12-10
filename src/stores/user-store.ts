import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserStoreType } from "@/Types";

const userStore = create(
    persist<UserStoreType>(
        (set) => ({
            user: null,
            userExists: true,
            setUser: (user) => set({ user: user, userExists: true }),
            resetUser: () => set({ user: null, userExists: false }),
        }),
        { name: "user-store", storage: createJSONStorage(() => localStorage) }
    )
);

export { userStore };
