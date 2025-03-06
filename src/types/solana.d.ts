// Solana Web3.js type declarations

declare module '@solana/web3.js' {
  export class PublicKey {
    constructor(value: string | number[] | Uint8Array);
    toString(): string;
    toBytes(): Uint8Array;
    equals(publicKey: PublicKey): boolean;
    toBase58(): string;
    static isOnCurve(value: Uint8Array): boolean;
  }

  export class Connection {
    constructor(endpoint: string, commitmentOrConfig?: string | any);
    getRecentBlockhash(commitment?: string): Promise<{ blockhash: string; lastValidBlockHeight: number }>;
    getLatestBlockhash(commitment?: string): Promise<{ blockhash: string; lastValidBlockHeight: number }>;
    getLatestBlockhashAndContext(commitment?: string): Promise<{ value: { blockhash: string; lastValidBlockHeight: number } }>;
    getBlockHeight(commitment?: string): Promise<number>;
    getConfirmedTransaction(signature: string, commitment?: string): Promise<any>;
    getParsedTransaction(signature: string, commitment?: string): Promise<any>;
    getTransaction(signature: string, options?: any): Promise<any>;
    getBalance(publicKey: PublicKey, commitment?: string): Promise<number>;
    getAccountInfo(publicKey: PublicKey, commitment?: string): Promise<any>;
    getParsedAccountInfo(publicKey: PublicKey, commitment?: string): Promise<any>;
    getProgramAccounts(programId: PublicKey, configOrCommitment?: any): Promise<Array<any>>;
    sendTransaction(transaction: Transaction, signers: Array<any>, options?: any): Promise<string>;
    sendRawTransaction(wireTransaction: Buffer | Uint8Array | Array<number>, options?: any): Promise<string>;
    confirmTransaction(signature: string | any, commitment?: string): Promise<any>;
  }

  export class Transaction {
    constructor(options?: any);
    add(...items: Array<any>): Transaction;
    sign(...signers: Array<any>): void;
    serialize(config?: any): Buffer;
    serializeMessage(): Buffer;
    recentBlockhash?: string;
    feePayer?: PublicKey;
  }

  export class SystemProgram {
    static transfer(params: {
      fromPubkey: PublicKey;
      toPubkey: PublicKey;
      lamports: number;
    }): any;
    static createAccount(params: any): any;
    static createAccountWithSeed(params: any): any;
    static allocate(params: any): any;
    static allocateWithSeed(params: any): any;
    static assign(params: any): any;
    static assignWithSeed(params: any): any;
    static createNonceAccount(params: any): any;
    static nonceAdvance(params: any): any;
    static nonceWithdraw(params: any): any;
    static authorizeNonceAccount(params: any): any;
  }

  export const LAMPORTS_PER_SOL: number;
}