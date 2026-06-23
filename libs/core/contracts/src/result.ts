export type Result<TValue, TError> =
  | Readonly<{ ok: true; value: TValue }>
  | Readonly<{ error: TError; ok: false }>;

export function ok<TValue>(value: TValue): Result<TValue, never> {
  return { ok: true, value };
}

export function err<TError>(error: TError): Result<never, TError> {
  return { error, ok: false };
}
