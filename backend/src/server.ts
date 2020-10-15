import './util/envs'
import express from 'express'
import cors from 'cors'
require('cross-fetch/polyfill')
import bodyParser from 'body-parser'
import { initDB } from './util/mongoose'
import { router } from './routes'
import { exceptionMiddleware } from './util/exceptionMiddleware'

if (process.env.NODE_ENV !== 'verifier') {
  const app = express()

  // Import and Set Nuxt.js options
  app.use(cors())

  app.use(bodyParser.json())

  app.use('/api', router)

  router.use(exceptionMiddleware)

  const PORT = process.env.PORT || 4000
  initDB()

  app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`)
  })
}
