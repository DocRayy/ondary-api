export function removePasswords<T>(value: T): T {
  return removePasswordsDeep(value, new WeakSet()) as T;
}

function removePasswordsDeep(value: unknown, seen: WeakSet<object>): unknown {
  if (!value || typeof value !== 'object' || value instanceof Date) {
    return value;
  }

  if (seen.has(value)) {
    return undefined;
  }
  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => removePasswordsDeep(item, seen));
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => key !== 'password')
      .map(([key, item]) => [key, removePasswordsDeep(item, seen)]),
  );
}
