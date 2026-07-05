export declare function isPasswordHashed(password: string): boolean;
export declare function hashPassword(password: string): Promise<string>;
export declare function verifyPassword(plainPassword: string, storedPassword: string): Promise<boolean>;
