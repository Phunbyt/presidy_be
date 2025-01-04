import * as bcrypt from 'bcrypt';

export const hashDataWithBycrypt = async (data: string) => {
  const salt = await bcrypt.genSalt(+process.env.BYCRYPT_SALT);

  return bcrypt.hash(data, salt);
};

export const compareDataWithBycrypt = async (valueA: string, valueB: string) =>
  bcrypt.compare(valueA, valueB);
