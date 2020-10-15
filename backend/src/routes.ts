import express from 'express'
export const router = express.Router()

import { router as invoicesRoutes } from './modules/invoices/src/routes'
import { router as offersRoutes } from './modules/offers/src/routes'
import { router as authRoutes } from './modules/auth/src/routes'
import { router as offersBagsRoutes } from './modules/offersBags/src/routes'
import { router as companiesRoutes } from './modules/companies/src/routes'
import { router as emailsRoutes } from './modules/emails/src/routes'
import { router as tradingBagsRoutes } from './modules/tradingBags/src/routes'
import { router as historyRoutes } from './modules/history/src/routes'

router.use('/invoices', invoicesRoutes)
router.use('/auth', authRoutes)
router.use('/offers', offersRoutes)
router.use('/offersBags', offersBagsRoutes)
router.use('/companies', companiesRoutes)
router.use('/tradingBags', tradingBagsRoutes)
router.use('/history', historyRoutes)
router.use('/emails', emailsRoutes)

router.get(
  '/bestOption',
  async (req: express.Request, res: express.Response) => {
    const headers = new Headers()
    headers.set('Authorization', req.headers['authorization'] as string)
    headers.set('Company-NIT', req.headers['company-nit'] as string)
    const response = await fetch(
      `http://localhost:8086/api/bestOption?value=${req.query.value}`,
      {
        method: 'GET',
        headers,
      }
    )
    if (!response.ok) {
      res.status(response.status).json(await response)
      return
    }
    const resp = await response.json()
    res.status(response.status).json(await resp)
  }
)
