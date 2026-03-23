import { create } from "zustand";

type SearchStore = {
    username: string | null | undefined;
    setUsername: (username: string | undefined) => void;  
}

export const useUsernameStore = create<SearchStore>((set) => ({
    username: null,
    setUsername: (username: string | undefined) => set({ username: username }),
}))