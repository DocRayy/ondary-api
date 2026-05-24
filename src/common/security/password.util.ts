import * as bcrypt from 'bcrypt';

const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$.{53}$/;
const SALT_ROUNDS = 12;

export function isPasswordHashed(password: string): boolean {
  return BCRYPT_HASH_PATTERN.test(password);
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  plainPassword: string,
  storedPassword: string,
): Promise<boolean> {
  if (isPasswordHashed(storedPassword)) {
    return bcrypt.compare(plainPassword, storedPassword);
  }

  return plainPassword === storedPassword;
}
