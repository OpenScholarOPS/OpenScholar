import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { walletService, tokenService } from '@/services/solana';
import type { TokenTransaction } from '@/types';

// Interface for wallet context
interface WalletContextType {
  publicKey: string | null;
  isConnected: boolean;
  isLoading: boolean;
  tokenBalance: number;
  transactions: TokenTransaction[];
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

// Create the context with default values
const WalletContext = createContext<WalletContextType>({
  publicKey: null,
  isConnected: false,
  isLoading: false,
  tokenBalance: 0,
  transactions: [],
  connect: async () => {},
  disconnect: async () => {},
  refreshBalance: async () => {},
  refreshTransactions: async () => {},
});

// Hook to use the wallet context
export const useWallet = () => useContext(WalletContext);

// Provider component
export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const isWalletConnected = walletService.isConnected();
        if (isWalletConnected) {
          const walletPublicKey = walletService.getPublicKey();
          if (walletPublicKey) {
            setPublicKey(walletPublicKey);
            setIsConnected(true);
            await refreshBalance();
            await refreshTransactions();
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkWalletConnection();
  }, []);

  // Connect wallet
  const connect = async () => {
    setIsLoading(true);
    try {
      const { publicKey: walletPublicKey, isConnected: walletConnected } = await walletService.connect();
      setPublicKey(walletPublicKey);
      setIsConnected(walletConnected);
      
      if (walletConnected && walletPublicKey) {
        await refreshBalance();
        await refreshTransactions();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet
  const disconnect = async () => {
    setIsLoading(true);
    try {
      await walletService.disconnect();
      setPublicKey(null);
      setIsConnected(false);
      setTokenBalance(0);
      setTransactions([]);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh token balance
  const refreshBalance = async () => {
    if (!publicKey) return;
    
    try {
      const balance = await tokenService.getTokenBalance(publicKey);
      setTokenBalance(balance);
    } catch (error) {
      console.error('Error refreshing token balance:', error);
    }
  };

  // Refresh transaction history
  const refreshTransactions = async () => {
    if (!publicKey) return;
    
    try {
      const txHistory = await tokenService.getTransactionHistory(publicKey);
      setTransactions(txHistory);
    } catch (error) {
      console.error('Error refreshing transactions:', error);
    }
  };

  // Context value
  const value = {
    publicKey,
    isConnected,
    isLoading,
    tokenBalance,
    transactions,
    connect,
    disconnect,
    refreshBalance,
    refreshTransactions,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}; 