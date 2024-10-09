import { create } from 'zustand';

interface WalletState {
  balance: number;
  getBalance: () => number;
  setBalance: (newBalance: number) => void;
}

const useWalletStore = create<WalletState>((set, get) => ({
  balance: 0,
  getBalance: () => {
    const state = get().balance
    return state
  },
  setBalance: (newBalance: number) => set({ balance: newBalance }),
}));

export default useWalletStore;