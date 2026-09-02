import { create } from 'zustand';

interface NeuralTunnelState {
  isOpen: boolean;
  openTunnel: () => void;
  closeTunnel: () => void;
  toggleTunnel: () => void;
}

export const useNeuralTunnelStore = create<NeuralTunnelState>((set) => ({
  isOpen: false,
  openTunnel: () => set({ isOpen: true }),
  closeTunnel: () => set({ isOpen: false }),
  toggleTunnel: () => set((state) => ({ isOpen: !state.isOpen })),
}));