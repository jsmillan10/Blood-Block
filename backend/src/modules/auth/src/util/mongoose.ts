'use strict'
import mongoose from 'mongoose'
const uri = process.env.DB_HOST
export const initDB = function (): void {
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  mongoose.set('useCreateIndex', true)
}
