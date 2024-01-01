import bcrypt from "bcrypt";
export const crypt = async (password) => {
  return bcrypt.hash(password, 12);
};

export const compair = async (password, crypted) => {
  return await bcrypt.compare(password, crypted);
};
