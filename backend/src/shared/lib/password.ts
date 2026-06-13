import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, salt);
}

export function verifyPassword(
  password: string,
  passwordHashed: string,
): boolean {
  return bcrypt.compareSync(password, passwordHashed);
}
