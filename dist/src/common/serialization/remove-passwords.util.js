"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePasswords = removePasswords;
function removePasswords(value) {
    return removePasswordsDeep(value, new WeakSet());
}
function removePasswordsDeep(value, seen) {
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
    return Object.fromEntries(Object.entries(value)
        .filter(([key]) => key !== 'password')
        .map(([key, item]) => [key, removePasswordsDeep(item, seen)]));
}
//# sourceMappingURL=remove-passwords.util.js.map