/**
 * Token encryption utilities using Web Crypto API
 * Encrypts tokens before storing in localStorage
 */

const ENCRYPTION_KEY_NAME = "memos-scratch-key";
const ENCRYPTION_ALGORITHM = "AES-GCM";

/**
 * Get or create a stable encryption key stored in localStorage
 * This approach is more robust than browser fingerprinting
 */
async function getEncryptionKey(): Promise<CryptoKey> {
  // Check if we have a stored key
  let keyData = localStorage.getItem(ENCRYPTION_KEY_NAME);

  if (!keyData) {
    // Generate a new random key
    const rawKey = crypto.getRandomValues(new Uint8Array(32));
    keyData = btoa(String.fromCharCode(...rawKey));
    localStorage.setItem(ENCRYPTION_KEY_NAME, keyData);
  }

  // Import the key for use with Web Crypto API
  const rawKey = Uint8Array.from(atob(keyData), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey("raw", rawKey, { name: ENCRYPTION_ALGORITHM, length: 256 }, false, ["encrypt", "decrypt"]);
}

/**
 * Encrypt a token string
 */
export async function encryptToken(token: string): Promise<string> {
  try {
    const key = await getEncryptionKey();
    const encoder = new TextEncoder();
    const data = encoder.encode(token);

    // Generate a random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encrypt the data
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv,
      },
      key,
      data,
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedData), iv.length);

    // Convert to base64
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Failed to encrypt token");
  }
}

/**
 * Decrypt a token string
 */
export async function decryptToken(encryptedToken: string): Promise<string> {
  try {
    const key = await getEncryptionKey();

    // Decode from base64
    const combined = Uint8Array.from(atob(encryptedToken), (c) => c.charCodeAt(0));

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encryptedData = combined.slice(12);

    // Decrypt the data
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv,
      },
      key,
      encryptedData,
    );

    // Convert back to string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Failed to decrypt token");
  }
}
