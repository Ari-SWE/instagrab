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
export function normalizeUsername(input: string): string {
  let cleaned = input.trim();

  // Remove leading @
  if (cleaned.startsWith('@')) {
    cleaned = cleaned.substring(1);
  }

  // Handle full Instagram URLs
  const urlPattern =
    /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._]+)\/?/;
  const match = cleaned.match(urlPattern);
  if (match) {
    cleaned = match[1];
  }

  // Remove trailing slashes
  cleaned = cleaned.replace(/\/+$/, '');

  return cleaned.toLowerCase();
}

/**
 * Validates that a username meets Instagram's requirements.
 * Instagram usernames: 1-30 chars, letters, numbers, periods, underscores.
 */
export function isValidUsername(username: string): boolean {
  if (!username || username.length === 0) return false;
  if (username.length > 30) return false;
  return /^[a-zA-Z0-9._]+$/.test(username);
}
