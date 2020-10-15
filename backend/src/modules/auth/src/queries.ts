import users from './util/models/users'
import IUser from './util/models/IUser'
import mongoose, { ClientSession } from 'mongoose'
import ISupplierCompany from './util/models/ISupplierCompany'
import IRetailerCompany from './util/models/IRetailerCompany'
import supplierCompany from './util/models/supplierCompany'
import retailerCompany from './util/models/retailerCompany'

export const findUser = async (email): Promise<IUser | null> => {
  return await users.findOne({ email }).exec()
}

export const findUsers = async (emails: string[]): Promise<IUser[]> => {
  return await users.find({ email: { $in: emails } }).exec()
}

export const updateUsers = async (
  suppliers: IUser[],
  session: ClientSession
): Promise<void> => {
  for (const supplier of suppliers) {
    await supplier.save({ session })
  }
}

export const createSupplierCompanies = async (
  companies,
  session
): Promise<ISupplierCompany[]> => {
  return await supplierCompany.create(companies, session)
}

export const createUsers = async (suppliers, session): Promise<IUser> => {
  return await users.create(suppliers, session)
}

// Devuelve un objeto clientSession, el cual representa una transacción
export const getTransaction = async (): Promise<ClientSession> => {
  const session = await mongoose.startSession()
  session.startTransaction()
  return session
}

export const getSupplierCompanyByNIT = async (
  NIT: string
): Promise<ISupplierCompany | null> => {
  return await supplierCompany.findOne({ NIT })
}

export const getRetailerCompanyByNIT = async (
  NIT: string
): Promise<IRetailerCompany | null> => {
  return await retailerCompany.findOne({ NIT })
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
