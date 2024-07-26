import checkArchivedSecret from "@/actions/check-archived-secret";
import { create } from "zustand";

interface SecurityModalStore {
  isOpen: boolean;
  locked: boolean;
  onOpen: () => void;
  onClose: () => void;
  onUnlock: (password: string) => void;
  onLock: () => void;
}

const useSecurityModal = create<SecurityModalStore>((set) => ({
  isOpen: false,
  locked: true,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  onUnlock: async (password: string) => {
    try {
      const { success } = await checkArchivedSecret(password);

      if (success) {
        set({ 
          locked: false, 
          isOpen: false 
        });
      }
    } catch (error) {
      console.log('[useSecurityModal] - fetchData - error while fetching data', error);
    }
  },
  onLock: () => set({ locked: true })
}));

export default useSecurityModal;