import users from './util/models/users'
import IUser from './util/models/IUser'
import mongoose, { ClientSession } from 'mongoose'

export const findUser = async (email): Promise<IUser | null> => {
  return await users.findOne({ email }).exec()
}

export const findUsers = async (emails: string[]): Promise<IUser[]> => {
  return await users.find({ email: { $in: emails } }).exec()
}

export const createUser = async (user: {
  email: string
  name: string
  password: string
  role: string
  refreshToken: string
}): Promise<IUser> => {
  return await users.create(user)
}
// Devuelve un objeto clientSession, el cual representa una transacción
export const getTransaction = async (): Promise<ClientSession> => {
  const session = await mongoose.startSession()
  session.startTransaction()
  return session
}

export const getObjectId = (_id: string): mongoose.Types.ObjectId => {
  return new mongoose.Types.ObjectId(_id)
}

// Hace rollback a una transacción
export const rollback = async (t: ClientSession): Promise<void> => {
  await t.abortTransaction()
}

// Hace commit a una transacción
export const commit = async (t: ClientSession): Promise<void> => {
  await t.commitTransaction()
}
