import { Document } from 'mongoose'

export default interface ISupplierCompany extends Document {
  NIT: string
  name: string
  logoURL: string | null
  totalAmount: number
  totalDiscount: number
  config: {
    defaultExpirationDays: number
    urgentDaysExpiration: number
    upcomingDaysExpiration: number
  }
}
