/**
 * Normalizes various Instagram username formats into a clean username string.
 *
 * Supported input formats:
 * - username
 * - @username
 * - https://www.instagram.com/username/
 * - https://instagram.com/username
 * - instagram.com/username/
 */
export declare function normalizeUsername(input: string): string;
/**
 * Validates that a username meets Instagram's requirements.
 * Instagram usernames: 1-30 chars, letters, numbers, periods, underscores.
 */
export declare function isValidUsername(username: string): boolean;
//# sourceMappingURL=usernameNormalizer.d.ts.map