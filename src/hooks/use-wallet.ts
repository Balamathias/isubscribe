import { useState, useEffect } from 'react';
import { getWallet } from '@/lib/supabase/wallets';
import { Tables } from '@/types/database';

interface WalletData extends Tables<'wallet'> {}

export interface UseWalletResult {
  wallet: WalletData | null;
  isLoading: boolean;
  error: Error | null;
}

export function useWallet(userId?: string): UseWalletResult {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchWallet() {
      try {
        setIsLoading(true);
        const { data, error } = await getWallet(userId);
        if (error) {
          throw error;
        }
        setWallet(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchWallet();
  }, [userId]);

  return { wallet, isLoading, error };
}
