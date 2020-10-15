import { Schema, Document, PaginateModel } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import ISupplierCompany from './ISupplierCompany'

import mongoose from 'mongoose'

const SupplierCompanySchema = new Schema({
  NIT: { type: String, required: true },
  name: { type: String, required: true },
  logoURL: { type: String, required: false, default: null },
  totalAmount: { type: Number, required: false, default: 0 },
  totalDiscount: { type: Number, required: false, default: 0 },
  config: {
    defaultExpirationDays: { type: Number, required: false, default: 7 },
    urgentDaysExpiration: { type: Number, required: false, default: 7 },
    upcomingDaysExpiration: { type: Number, required: false, default: 15 },
  },
})

SupplierCompanySchema.plugin(mongoosePaginate)

type SupplierCompanyModel<T extends Document> = PaginateModel<T>

// Export the model and return your ISupplierCompany interface

export default mongoose.models.supplierCompany ||
  (mongoose.model<ISupplierCompany>(
    'supplierCompany',
    SupplierCompanySchema,
    'supplierCompany'
  ) as SupplierCompanyModel<ISupplierCompany>)
