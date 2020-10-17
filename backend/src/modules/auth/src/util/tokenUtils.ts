import IUser from './models/IUser'
import * as crypto from 'crypto'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

export const validateToken = async (req): Promise<string> => {
  const token = req.header('Authorization')
  if (!token) {
    const error = new Error('Debe estar autenticado para realizar esta función')
    throw { ...error, statusCode: 422 }
  }
  const email = await new Promise<string>((resolve, reject) => {
    jwt.verify(token, process.env.PRIVATE_KEY, function (err, decoded) {
      if (err) {
        console.log(err)
        const error = new Error('Token incorrecto')
        reject({ ...error, statusCode: 422 })
      } else {
        resolve(decoded.email)
      }
    })
  })
  return email
}

export const sign = (email: string, user: IUser): string => {
  return jwt.sign(
    {
      email,
      id: user.id,
      role: user.role,
    },
    process.env.PRIVATE_KEY,
    { expiresIn: '12h' }
  )
}

export const createRefreshToken = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(50, function (err, buffer) {
      if (err) {
        reject(err)
      }
      const token = buffer.toString('hex')
      resolve(token)
    })
  })
}

export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, 12)
}

export const verifyPassword = (
  password1: string,
  password2: string
): Promise<boolean> => {
  return bcrypt.compare(password1, password2)
}
