import jwt from 'jsonwebtoken';

const getSignedJwtToken = (hash: string) => {
  if (process.env.JWT_SECRET === undefined || process.env.JWT_EXPIRE === undefined) {
    throw new Error('JWT_SECRET or JWT_EXPIRE is undefined');
  }
  return jwt.sign({ hash: hash }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export default getSignedJwtToken;
