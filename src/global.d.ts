// Global type declarations to fix TypeScript errors

// React module declarations
declare module 'react' {
  import * as React from 'react';
  export = React;
  export as namespace React;
}

// React DOM module declarations
declare module 'react-dom' {
  import * as ReactDOM from 'react-dom';
  export = ReactDOM;
  export as namespace ReactDOM;
}

declare module 'react-dom/client' {
  import * as ReactDOMClient from 'react-dom/client';
  export = ReactDOMClient;
}

// React Router DOM module declarations
declare module 'react-router-dom' {
  export interface LinkProps {
    to: string;
    replace?: boolean;
    state?: any;
    className?: string;
    onClick?: () => void;
    [key: string]: any;
  }
  
  export const Link: React.FC<LinkProps>;
  export const NavLink: React.FC<LinkProps & { end?: boolean }>;
  export const Outlet: React.FC;
  export const useNavigate: () => (path: string) => void;
  export const useParams: <T extends Record<string, string>>() => T;
  export const Routes: React.FC<{ children: React.ReactNode }>;
  export const Route: React.FC<{
    path: string;
    element: React.ReactNode;
    index?: boolean;
    children?: React.ReactNode;
  }>;
  export const Navigate: React.FC<{ to: string; replace?: boolean }>;
  export const BrowserRouter: React.FC<{ children: React.ReactNode }>;
}

// Lucide React module declarations
declare module 'lucide-react' {
  export const Home: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const User: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Mail: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Lock: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Search: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Menu: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const X: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Bell: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const ChevronDown: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const LogOut: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Edit: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Save: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const MessageSquare: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const ThumbsUp: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Share: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Clock: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const CornerDownRight: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const ArrowLeft: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const ArrowRight: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const ArrowUp: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const ArrowDown: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Filter: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Plus: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Layers: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Tag: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Hash: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Check: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const CheckCircle: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const FileText: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Award: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const UserCheck: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Send: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Wallet: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const RefreshCw: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const ExternalLink: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const CircleDollarSign: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Github: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Twitter: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Globe: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Loader2: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const GitHub: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Sun: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Moon: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const BookOpen: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Users: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Calendar: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Book: React.FC<{ className?: string; size?: number; [key: string]: any }>;
  export const Download: React.FC<{ className?: string; size?: number; [key: string]: any }>;
}

// Framer Motion module declaration
declare module 'framer-motion' {
  export const motion: any;
}

// Class-variance-authority module declaration
declare module 'class-variance-authority' {
  export function cva(base: string, config: any): any;
  export type VariantProps<T> = any;
}

// Clsx module declaration
declare module 'clsx' {
  export function clsx(...inputs: any[]): string;
  export type ClassValue = any;
  export default clsx;
}

// Tailwind-merge module declaration
declare module 'tailwind-merge' {
  export function twMerge(...inputs: string[]): string;
}

// Declare environment variables
interface ImportMeta {
  env: {
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_ANON_KEY: string;
    VITE_SOLANA_RPC_URL: string;
    VITE_OPS_TOKEN_MINT: string;
    [key: string]: any;
  };
}

// Fix JSX namespace
declare namespace JSX {
  interface IntrinsicElements {
    [elementName: string]: any;
  }
} 