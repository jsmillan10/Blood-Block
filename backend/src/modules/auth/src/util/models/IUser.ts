import { Document } from 'mongoose'

export default interface IUser extends Document {
  email: string
  companies: [{ NIT: string; role: role; NITRetailer: string; name: string }]
}

// 0 Pendientes, 1 aceptadas, 2 contraofertadas, 3 expirada
enum role {
  admin = 'admin',
  supplier = 'supplier',
}
