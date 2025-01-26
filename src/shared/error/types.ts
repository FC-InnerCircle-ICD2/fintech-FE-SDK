export type ErrorInfo<T> = {
  name: T;
  message: string;
  code?: number;
  cause?: unknown;
};

export type ErrorConfig<T> = Record<string, ErrorInfo<T>>;
