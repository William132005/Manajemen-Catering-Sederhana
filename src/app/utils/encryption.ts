// ChaCha20-like simulation utility
// Using XOR keystream with random nonce for consistent encrypt/decrypt

const STABLE_KEY = "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b";

function hexToBytes(hex: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < hex.length; i += 2)
    bytes.push(parseInt(hex.substring(i, i + 2), 16));
  return bytes;
}

export function chacha20Encrypt(plaintext: string): string {
  try {
    const keyBytes = hexToBytes(STABLE_KEY);
    const textBytes = Array.from(new TextEncoder().encode(plaintext));
    const nonce = Array.from({ length: 12 }, () => Math.floor(Math.random() * 256));
    const encrypted = textBytes.map((b, i) => b ^ keyBytes[i % keyBytes.length] ^ nonce[i % 12]);
    const combined = [...nonce, ...encrypted];
    return btoa(String.fromCharCode(...combined));
  } catch {
    return "";
  }
}

export function chacha20Decrypt(ciphertext: string): string {
  try {
    const keyBytes = hexToBytes(STABLE_KEY);
    const combined = Array.from(atob(ciphertext)).map(c => c.charCodeAt(0));
    const nonce = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    const decrypted = encrypted.map((b, i) => b ^ keyBytes[i % keyBytes.length] ^ nonce[i % 12]);
    return new TextDecoder().decode(new Uint8Array(decrypted));
  } catch {
    return "❌ Error: Ciphertext tidak valid";
  }
}

export function shortCipher(text: string): string {
  const enc = chacha20Encrypt(text);
  return enc.length > 24 ? enc.substring(0, 24) + "..." : enc;
}

export function generateHex(len: number): string {
  return Array.from({ length: len }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("");
}

export function generateNetworkData() {
  const o = () => Math.floor(Math.random() * 254) + 1;
  const hb = () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0").toUpperCase();
  const hw = () => Math.floor(Math.random() * 65536).toString(16).padStart(4, "0");
  return {
    ipv4: `192.168.${o()}.${o()}`,
    ipv6: `fe80::${hw()}:${hw()}:${hw()}:${hw()}`,
    mac: `${hb()}:${hb()}:${hb()}:${hb()}:${hb()}:${hb()}`,
    provider: "Telkom Indonesia (AS7713)",
    hostname: `DESKTOP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    interfaceId: `eth${Math.floor(Math.random() * 3)}`,
    status: "Terhubung" as const,
    updatedAt: new Date().toLocaleTimeString("id-ID"),
  };
}

export const STABLE_KEY_DISPLAY = STABLE_KEY;