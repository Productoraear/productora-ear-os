
/**
 * Astra OS Crypto Service
 * Implements AES-GCM for client-side encryption of sensitive data.
 * Zero-knowledge architecture: The server (if connected) never sees the raw data.
 */

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;

// Convert string to ArrayBuffer
const str2ab = (str: string): ArrayBuffer => {
  const enc = new TextEncoder();
  return enc.encode(str).buffer;
};

// Convert ArrayBuffer to string
const ab2str = (buf: ArrayBuffer): string => {
  const dec = new TextDecoder();
  return dec.decode(buf);
};

// Convert ArrayBuffer to Base64
const ab2base64 = (buf: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buf);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// Convert Base64 to ArrayBuffer
const base642ab = (base64: string): ArrayBuffer => {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};

export const cryptoService = {
  /**
   * Generates a new random encryption key.
   * In a real app, this would be derived from a user password or stored in a secure enclave.
   */
  generateKey: async (): Promise<CryptoKey> => {
    return window.crypto.subtle.generateKey(
      {
        name: ALGORITHM,
        length: KEY_LENGTH,
      },
      true,
      ['encrypt', 'decrypt']
    );
  },

  /**
   * Exports key to base64 string for storage (e.g., in localStorage or user clipboard)
   */
  exportKey: async (key: CryptoKey): Promise<string> => {
    const exported = await window.crypto.subtle.exportKey('raw', key);
    return ab2base64(exported);
  },

  /**
   * Imports key from base64 string
   */
  importKey: async (base64Key: string): Promise<CryptoKey> => {
    const rawKey = base642ab(base64Key);
    return window.crypto.subtle.importKey(
      'raw',
      rawKey,
      { name: ALGORITHM },
      true,
      ['encrypt', 'decrypt']
    );
  },

  /**
   * Encrypts data string. Returns object with IV and Ciphertext.
   */
  encrypt: async (data: string, key: CryptoKey): Promise<{ iv: string; ciphertext: string }> => {
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 12 bytes for GCM
    const encodedData = str2ab(data);

    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      key,
      encodedData
    );

    return {
      iv: ab2base64(iv.buffer),
      ciphertext: ab2base64(ciphertext),
    };
  },

  /**
   * Decrypts data.
   */
  decrypt: async (ivStr: string, ciphertextStr: string, key: CryptoKey): Promise<string> => {
    const iv = base642ab(ivStr);
    const ciphertext = base642ab(ciphertextStr);

    try {
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: ALGORITHM,
          iv: iv,
        },
        key,
        ciphertext
      );
      return ab2str(decrypted);
    } catch (e) {
      console.error("Decryption failed:", e);
      throw new Error("Clave incorrecta o datos corruptos.");
    }
  }
};
