// Supabase type declarations

declare module '@supabase/supabase-js' {
  export interface SupabaseClientOptions {
    auth?: {
      autoRefreshToken?: boolean;
      persistSession?: boolean;
      detectSessionInUrl?: boolean;
    };
  }

  export interface User {
    id: string;
    app_metadata: {
      provider?: string;
      [key: string]: any;
    };
    user_metadata: {
      [key: string]: any;
    };
    aud: string;
    email?: string;
    created_at: string;
    confirmed_at?: string;
    last_sign_in_at?: string;
    role?: string;
    updated_at?: string;
  }

  export interface Session {
    provider_token?: string;
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
    expires_at?: number;
    token_type: string;
    user: User;
  }

  export interface PostgrestResponse<T> {
    data: T | null;
    error: Error | null;
    count?: number;
    status: number;
    statusText: string;
  }

  export interface PostgrestSingleResponse<T> extends PostgrestResponse<T> {
    data: T | null;
  }

  export interface PostgrestMaybeSingleResponse<T> extends PostgrestResponse<T> {
    data: T | null;
  }

  export interface PostgrestFilterBuilder<T> {
    eq: (column: string, value: any) => PostgrestFilterBuilder<T>;
    neq: (column: string, value: any) => PostgrestFilterBuilder<T>;
    gt: (column: string, value: any) => PostgrestFilterBuilder<T>;
    gte: (column: string, value: any) => PostgrestFilterBuilder<T>;
    lt: (column: string, value: any) => PostgrestFilterBuilder<T>;
    lte: (column: string, value: any) => PostgrestFilterBuilder<T>;
    like: (column: string, pattern: string) => PostgrestFilterBuilder<T>;
    ilike: (column: string, pattern: string) => PostgrestFilterBuilder<T>;
    is: (column: string, value: any) => PostgrestFilterBuilder<T>;
    in: (column: string, values: any[]) => PostgrestFilterBuilder<T>;
    contains: (column: string, value: any | any[]) => PostgrestFilterBuilder<T>;
    containedBy: (column: string, value: any[]) => PostgrestFilterBuilder<T>;
    rangeLt: (column: string, range: string) => PostgrestFilterBuilder<T>;
    rangeGt: (column: string, range: string) => PostgrestFilterBuilder<T>;
    rangeGte: (column: string, range: string) => PostgrestFilterBuilder<T>;
    rangeLte: (column: string, range: string) => PostgrestFilterBuilder<T>;
    rangeAdjacent: (column: string, range: string) => PostgrestFilterBuilder<T>;
    overlaps: (column: string, value: string[] | string) => PostgrestFilterBuilder<T>;
    textSearch: (column: string, query: string, options?: { config?: string }) => PostgrestFilterBuilder<T>;
    filter: (column: string, operator: string, value: any) => PostgrestFilterBuilder<T>;
    or: (filters: string, options?: { foreignTable?: string }) => PostgrestFilterBuilder<T>;
    select: (columns?: string, options?: { head?: boolean; count?: 'exact' | 'planned' | 'estimated' }) => PostgrestFilterBuilder<T>;
    order: (column: string, options?: { ascending?: boolean; nullsFirst?: boolean; foreignTable?: string }) => PostgrestFilterBuilder<T>;
    limit: (count: number, options?: { foreignTable?: string }) => PostgrestFilterBuilder<T>;
    range: (from: number, to: number, options?: { foreignTable?: string }) => PostgrestFilterBuilder<T>;
    single: () => Promise<PostgrestSingleResponse<T>>;
    maybeSingle: () => Promise<PostgrestMaybeSingleResponse<T>>;
  }

  export interface SupabaseAuthClient {
    signUp: (params: { email: string; password: string; options?: any }) => Promise<{ data: any; error: Error | null }>;
    signInWithPassword: (params: { email: string; password: string }) => Promise<{ data: any; error: Error | null }>;
    signOut: () => Promise<{ error: Error | null }>;
    getUser: () => Promise<{ data: { user: User | null }; error: Error | null }>;
    onAuthStateChange: (callback: (event: string, session: Session | null) => void) => { data: { subscription: any }; error: Error | null };
  }

  export interface SupabaseClient {
    from: <T = any>(table: string) => PostgrestFilterBuilder<T>;
    auth: SupabaseAuthClient;
    rpc: (fn: string, params?: any) => Promise<{ data: any; error: Error | null }>;
  }

  export function createClient(
    supabaseUrl: string,
    supabaseKey: string,
    options?: SupabaseClientOptions
  ): SupabaseClient;
} 