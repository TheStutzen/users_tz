import * as bcrypt from 'bcrypt'

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  const salt = await bcrypt.genSalt(saltRounds)
  return await bcrypt.hash(password, salt)
}
