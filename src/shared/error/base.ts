import type { ErrorInfo } from './types';

export class BaseError<T extends string> extends Error {
  name: T;
  message: string;
  code?: number;
  cause?: unknown;

  constructor({ name, message, code, cause }: ErrorInfo<T>) {
    super(message);
    this.name = name;
    this.message = message;
    this.code = code;
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
