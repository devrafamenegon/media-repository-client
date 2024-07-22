import { Media } from '@/types';
import { create } from 'zustand';

interface MediaStore {
  medias: Media[]
  setMedias: (data: Media[]) => void;
}

const useMediaStore = create<MediaStore>((set) => ({
  medias: [],
  setMedias: (data) => set({ medias: data }),
}));

export default useMediaStore;