'use strict'
import { initDB as initDB1 } from '../modules/invoices/src/util/mongoose'
import { initDB as initDB2 } from '../modules/offers/src/util/mongoose'
import { initDB as initDB4 } from '../modules/emails/src/util/mongoose'

export let initDB
if (process.env.NODE_ENV !== 'verifier') {
  const dbConnections = [initDB1, initDB2, initDB4]

  initDB = function (): void {
    for (const initDBT of dbConnections) {
      initDBT()
    }
  }
}
