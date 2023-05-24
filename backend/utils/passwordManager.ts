import bcrypt from 'bcryptjs';

const generateHashedPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const comparePassword = async (password: string, hashedPassword: string) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

export { generateHashedPassword, comparePassword };
