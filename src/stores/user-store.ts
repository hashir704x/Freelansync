import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserStoreType } from "@/Types";

const userStore = create(
    persist<UserStoreType>(
        (set) => ({
            user: null,
            userExists: false,
            setUser: (user) => set({ user, userExists: true }),
            resetUser: () => set({ user: null, userExists: false }),
            activeChat: null,
            setActiveChat: (chat) => set({ activeChat: chat }),
            setWalletAmount: (amount) =>
                set((state) => ({
                    user: state.user ? { ...state.user, wallet_amount: amount } : null,
                })),
        }),
        {
            name: "user-store",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export { userStore };
