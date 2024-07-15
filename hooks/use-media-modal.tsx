import { Media } from "@/types";
import { create } from "zustand";

interface MediaModalStore {
  isOpen: boolean;
  data?: Media;
  onOpen: (data: Media) => void;
  onClose: () => void;
}

const useMediaModal = create<MediaModalStore>((set) => ({
  isOpen: false,
  data: undefined,
  onOpen: (data: Media) => set({ data, isOpen: true }),
  onClose: () => set({ isOpen: false })
}));

export default useMediaModal;