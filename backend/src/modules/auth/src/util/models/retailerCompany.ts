import { Schema, Document, PaginateModel } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
import IRetailerCompany from './IRetailerCompany'

import mongoose from 'mongoose'

const RetailerCompanySchema = new Schema({
  NIT: { type: String, required: true },
  name: { type: String, required: true },
  logoURL: { type: String, required: false },
  totalAmount: { type: Number, required: false, default: 0 },
  totalDiscount: { type: Number, required: false, default: 0 },
  config: {
    totalCashFlow: { type: Number, required: false, default: 0 },
    availableCashFlow: { type: Number, required: false, default: 0 },
    cutoffDate: {
      type: Date,
      required: false,
      default: (): Date => {
        const d = new Date()
        return new Date(d.getTime() + 31 * 24 * 3600 * 1000)
      },
    }, //La fecha de corte por defecto inicial es en 1 mes
    minDiscount: { type: Number, required: false, default: 0 },
    maxDiscount: { type: Number, required: false, default: 0 },
    defaultExpirationDays: { type: Number, required: false, default: 7 },
    urgentDaysExpiration: { type: Number, required: false, default: 7 },
    upcomingDaysExpiration: { type: Number, required: false, default: 15 },
  },
})

RetailerCompanySchema.plugin(mongoosePaginate)

type RetailerCompanyModel<T extends Document> = PaginateModel<T>

// Export the model and return your IRetailerCompany interface

export default mongoose.models.retailerCompany ||
  (mongoose.model<IRetailerCompany>(
    'retailerCompany',
    RetailerCompanySchema,
    'retailerCompany'
  ) as RetailerCompanyModel<IRetailerCompany>)
