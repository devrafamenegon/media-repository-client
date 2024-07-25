import { create } from "zustand";

interface SecurityModalStore {
  isOpen: boolean;
  locked: boolean;
  onOpen: () => void;
  onClose: () => void;
  onUnlock: (password: string) => void;
}

const useSecurityModal = create<SecurityModalStore>((set) => ({
  isOpen: false,
  locked: true,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  onUnlock: (password: string) => {
    if (password === process.env.SECRET) {
      set({ locked: false });
    }
  }
}));

export default useSecurityModal;