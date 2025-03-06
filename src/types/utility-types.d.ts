// Utility type declarations

// Helper types for React event handlers
declare namespace React {
  // Form events
  interface FormEvent<T = Element> {
    preventDefault(): void;
    stopPropagation(): void;
    target: T;
    currentTarget: T;
  }

  // Change events
  interface ChangeEvent<T = Element> {
    target: T & {
      value: string;
      name?: string;
      checked?: boolean;
      type?: string;
    };
  }

  // Keyboard events
  interface KeyboardEvent<T = Element> {
    key: string;
    code: string;
    preventDefault(): void;
    stopPropagation(): void;
    target: T;
    currentTarget: T;
  }

  // Mouse events
  interface MouseEvent<T = Element> {
    preventDefault(): void;
    stopPropagation(): void;
    target: T;
    currentTarget: T;
  }

  // ReactNode type
  type ReactNode = 
    | React.ReactElement
    | string
    | number
    | boolean
    | null
    | undefined
    | React.ReactNodeArray;

  type ReactNodeArray = Array<ReactNode>;

  interface ReactElement {
    type: any;
    props: any;
    key: any;
  }
} 