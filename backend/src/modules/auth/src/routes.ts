import express from 'express'
import { validate } from './validator'
import * as auth from './controller'
import { exceptionHandler } from './util/errorHandler'
export const router = express.Router()

// RefreshToken
router.post(
  '/refreshToken',
  validate('refreshToken'),
  exceptionHandler(auth.refreshToken)
)

// RefreshToken
router.post('/create', validate('create'), exceptionHandler(auth.createUser))

// Hacer login
router.post('/', validate('login'), exceptionHandler(auth.login))
