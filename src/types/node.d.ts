// Node.js type declarations

declare module 'node:path' {
  export function resolve(...paths: string[]): string;
  export function join(...paths: string[]): string;
  export function basename(path: string, ext?: string): string;
  export function dirname(path: string): string;
  export function extname(path: string): string;
  export function isAbsolute(path: string): boolean;
  export function normalize(path: string): string;
  export function parse(path: string): {
    root: string;
    dir: string;
    base: string;
    ext: string;
    name: string;
  };
  export function relative(from: string, to: string): string;
}

declare module 'path' {
  export * from 'node:path';
  export default {
    resolve: (...paths: string[]) => string,
    join: (...paths: string[]) => string,
    basename: (path: string, ext?: string) => string,
    dirname: (path: string) => string,
    extname: (path: string) => string,
    isAbsolute: (path: string) => boolean,
    normalize: (path: string) => string,
    parse: (path: string) => {
      root: string;
      dir: string;
      base: string;
      ext: string;
      name: string;
    },
    relative: (from: string, to: string) => string,
  };
}

// Vite related declarations
declare module 'vite' {
  export function defineConfig(config: any): any;
}

declare module '@vitejs/plugin-react' {
  export default function react(options?: any): any;
}

// Global Node.js variables
declare var __dirname: string;
declare var __filename: string;
declare var process: {
  env: Record<string, string>;
  cwd: () => string;
  [key: string]: any;
}; 