import crypto from 'crypto';
const generateHash = (...args: (string|number)[]) => {
  let hashArray = [Math.random().toString(), Date.now().toString()].join('');
  hashArray = hashArray + args.join('');
  return crypto.createHash('sha256').update(hashArray).digest('hex');
};

export default generateHash;
