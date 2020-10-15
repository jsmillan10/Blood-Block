import { Schema, Document, PaginateModel } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import IUser from './IUser'

import mongoose from 'mongoose'

const autoIndex = process.env.NODE_ENV !== 'production'

const UserSchema = new Schema(
  {
    email: { type: String, required: true },
    companies: [
      {
        NIT: { type: String, required: true },
        role: { type: String, enum: ['admin', 'supplier'], required: true },
        NITRetailer: { type: String, required: true },
        name: { type: String, required: true },
      },
    ],
  },
  { autoIndex }
)

UserSchema.index({ email: 1 })

UserSchema.index({ 'companies.NIT': 1 })

UserSchema.index({ 'companies.NITRetailer': 1 })

UserSchema.plugin(mongoosePaginate)

type UserModel<T extends Document> = PaginateModel<T>

// Export the model and return your IUser interface

export default (mongoose.models.users as UserModel<IUser>) ||
  (mongoose.model<IUser>('users', UserSchema) as UserModel<IUser>)
