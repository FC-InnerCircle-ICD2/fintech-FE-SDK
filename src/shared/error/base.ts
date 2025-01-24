export class BaseError<T extends string> extends Error {
  name: T;
  message: string;
  code?: number;
  cause?: unknown;

  constructor({
    name,
    message,
    code,
    cause,
  }: {
    name: T;
    message: string;
    code?: number;
    cause?: unknown;
  }) {
    super(message);
    this.name = name;
    this.message = message;
    this.code = code;
    this.cause = cause;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
