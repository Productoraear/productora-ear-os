import crypto from 'crypto';

function base32Decode(base32: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  const output: number[] = [];
  const clean = base32.toUpperCase().replace(/=+$/, '').replace(/[^A-Z2-7]/g, '');
  
  for (let i = 0; i < clean.length; i++) {
    const index = alphabet.indexOf(clean[i]);
    if (index === -1) continue;
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(output);
}

export function verifyGoogleAuthenticator(token: string, secretBase32: string): boolean {
  if (!token || token.trim().length !== 6) return false;
  const cleanToken = token.trim();
  try {
    const secret = base32Decode(secretBase32);
    if (secret.length === 0) return false;
    
    const timeStep = 30;
    const now = Math.floor(Date.now() / 1000);
    const currentCounter = Math.floor(now / timeStep);

    // Permitir ventana de ±30 segundos para descompensaciones de reloj
    for (let i = -1; i <= 1; i++) {
      const counter = currentCounter + i;
      const buf = Buffer.alloc(8);
      buf.writeBigInt64BE(BigInt(counter), 0);
      const hmac = crypto.createHmac('sha1', secret).update(buf).digest();
      const offset = hmac[hmac.length - 1] & 0x0f;
      const code = ((hmac.readUInt32BE(offset) & 0x7fffffff) % 1000000).toString().padStart(6, '0');
      
      if (code === cleanToken) return true;
    }
  } catch (e) {
    console.error('Error en verificación TOTP Google Authenticator:', e);
  }
  return false;
}
