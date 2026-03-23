import { create } from "zustand";

type SearchStore = {
    phoneNumber: string | null | undefined;
    setPhoneNumber: (phoneNumber: string | undefined) => void;  
    setPhoneNumberExists: (exists: boolean) => void;
    phoneNumberExists: boolean;
}

export const usePhoneNumberStore = create<SearchStore>((set) => ({
    phoneNumber: null,
    setPhoneNumber: (phoneNumber: string | undefined) => set({ phoneNumber: phoneNumber }),
    setPhoneNumberExists: (exists: boolean) => set({ phoneNumberExists: exists }),
    phoneNumberExists: false,
}))