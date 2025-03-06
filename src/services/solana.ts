import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import type { TokenTransaction, TransactionStatus, TransactionType } from '@/types';

// These values would typically be stored in environment variables
const solanaRpcUrl = import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const opsTokenMintAddress = import.meta.env.VITE_OPS_TOKEN_MINT || '';

// Initialize Solana connection
export const connection = new Connection(solanaRpcUrl);

// Phantom wallet interface
export interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
  connect: () => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: string, callback: (args: any) => void) => void;
}

// Get the Phantom provider from the window object
export const getProvider = (): PhantomProvider | undefined => {
  if ('solana' in window) {
    const provider = (window as any).solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
  return undefined;
};

// Solana wallet service
export const walletService = {
  // Connect to Phantom wallet
  async connect() {
    const provider = getProvider();
    if (!provider) {
      throw new Error('Phantom wallet not found! Please install the browser extension.');
    }
    
    try {
      const { publicKey } = await provider.connect();
      return {
        publicKey: publicKey.toString(),
        isConnected: true,
      };
    } catch (error) {
      console.error('Error connecting to wallet:', error);
      throw error;
    }
  },
  
  // Disconnect from Phantom wallet
  async disconnect() {
    const provider = getProvider();
    if (provider) {
      await provider.disconnect();
      return { isConnected: false };
    }
  },
  
  // Check if wallet is connected
  isConnected() {
    const provider = getProvider();
    return provider?.isConnected || false;
  },
  
  // Get wallet public key
  getPublicKey() {
    const provider = getProvider();
    return provider?.publicKey?.toString() || null;
  },
  
  // Transfer SOL between wallets (simplified implementation for MVP)
  async transferSOL(toPublicKey: string, amount: number) {
    const provider = getProvider();
    if (!provider || !provider.publicKey) {
      throw new Error('Wallet not connected');
    }
    
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: new PublicKey(toPublicKey),
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );
    
    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = provider.publicKey;
    
    // Sign transaction
    const signedTransaction = await provider.signTransaction(transaction);
    
    // Send transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    
    // Confirm transaction
    await connection.confirmTransaction(signature);
    
    return {
      signature,
      status: 'confirmed',
    };
  },
};

// Token service for $OPS tokens (simplified for MVP)
export const tokenService = {
  // Get token balance (in a real implementation, this would use the SPL Token program)
  async getTokenBalance(publicKey: string) {
    // For MVP, we're mocking this functionality
    // In a real implementation, you would query the SPL Token account balance
    return 100; // Mock balance
  },
  
  // Record a token transaction in the database
  async recordTransaction(transaction: {
    from: string;
    to: string;
    amount: number;
    type: TransactionType;
  }) {
    // In a real implementation, this would be recorded in Supabase
    const mockTransaction: TokenTransaction = {
      id: `tx-${Date.now()}`,
      from: transaction.from,
      to: transaction.to,
      amount: transaction.amount,
      type: transaction.type,
      status: TransactionStatus.COMPLETED,
      signature: `mock-signature-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    return mockTransaction;
  },
  
  // Get transaction history
  async getTransactionHistory(publicKey: string) {
    // In a real implementation, this would query Supabase
    // For MVP, return mock data
    const mockTransactions: TokenTransaction[] = [
      {
        id: 'tx-1',
        from: 'system',
        to: publicKey,
        amount: 50,
        type: TransactionType.CONTRIBUTION_REWARD,
        status: TransactionStatus.COMPLETED,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'tx-2',
        from: publicKey,
        to: 'user-123',
        amount: 5,
        type: TransactionType.DISCUSSION_TIP,
        status: TransactionStatus.COMPLETED,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];
    
    return mockTransactions;
  },
}; 