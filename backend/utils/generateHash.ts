import crypto from 'crypto';
const generateHash = (...args: string[]) => {
  let hashArray = [Math.random().toString(), Date.now().toString()].join('');
  hashArray = hashArray + args.join('');
  return crypto.createHash('sha256').update(args.join('')).digest('hex');
};

export default generateHash;
