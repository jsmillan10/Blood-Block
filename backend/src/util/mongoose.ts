'use strict'
import { initDB as initDB1 } from '../modules/auth/src/util/mongoose'

export let initDB
if (process.env.NODE_ENV !== 'verifier') {
  const dbConnections = [initDB1]

  initDB = function (): void {
    for (const initDBT of dbConnections) {
      initDBT()
    }
  }
}
