export type ErrorInfo<T> = {
  name: T;
  message: string;
  code?: number;
  cause?: unknown;
};

export type ErrorConfig<T> = Record<string, ErrorInfo<T>>;

export type ErrorName<T extends Record<string, { name: string }>> =
  T[keyof T]['name'];

export type ErrorCode<T> = Exclude<
  {
    [K in keyof T]: T[K] extends {
      code: infer C;
    }
      ? C
      : never;
  }[keyof T],
  never
>;
