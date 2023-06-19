import crypto from 'crypto';

const algorithm = 'aes-256-cbc'; // Encryption algorithm
const originalKey = process.env.ENCRYPTION_KEY as string; // Encryption key
const key = crypto.createHash('sha256').update(String(originalKey)).digest();

export const encrypt = (text: string) => {
  const iv = crypto.randomBytes(16); // Initialization vector (IV)
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const hexIv = iv.toString('hex');
  return {encrypted, iv: hexIv};
}

export const decrypt = (encryptedText: string, hexIv: string) => {
  // Convert the hex representation of the IV back to a Buffer.
  const iv = Buffer.from(hexIv, 'hex');

  // Create a decipher using the same algorithm, key, and iv as was used to encrypt the original text.
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encryptedText, 'hex', 'hex');
  decrypted += decipher.final('hex');
  decrypted = Buffer.from(decrypted, 'hex').toString('utf8');
  return decrypted;
};
