import { Document } from 'mongoose'

export default interface IRetailerCompany extends Document {
  NIT: string
  name: string
  logoURL: string
  totalAmount: number
  totalDiscount: number
  config: {
    totalCashFlow: number
    availableCashFlow: number
    cutoffDate: Date
    defaultExpirationDays: number
    minDiscount: number
    maxDiscount: number
    urgentDaysExpiration: number
    upcomingDaysExpiration: number
  }
}
