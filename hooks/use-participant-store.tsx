import { Media, Participant } from '@/types';
import { create } from 'zustand';

interface ParticipantStore {
  participants: Participant[]
  setParticipants: (data: Participant[]) => void;
}

const useParticipantStore = create<ParticipantStore>((set) => ({
  participants: [],
  setParticipants: (data) => set({ participants: data }),
}));

export default useParticipantStore;