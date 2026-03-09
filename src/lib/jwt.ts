import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this'

export async function verifyJWT(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
      role: string
    }
  } catch (error) {
    return null
  }
}

export function signJWT(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}
