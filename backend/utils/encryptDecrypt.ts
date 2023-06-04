import cryptoJS from "crypto-js";

export const encrypt = (text:string) => {
  const encrypted = cryptoJS.AES.encrypt(text, process.env.ENCRYPTION_KEY as string).toString();
  return encrypted
}

export const decrypt = (text:string) => {
  const decrypted = cryptoJS.AES.decrypt(text, process.env.ENCRYPTION_KEY as string).toString(cryptoJS.enc.Utf8);
  return decrypted
}