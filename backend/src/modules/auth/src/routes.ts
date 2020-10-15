import express from 'express'
import { exceptionHandler } from './util/exceptionHandler'
import { validate, verifyUser } from './validator'
import * as auth from './controller'
export const router = express.Router()
// Hacer login
router.post('/', validate('login'), exceptionHandler(auth.login))

// Cambiar contraseña
router.post(
  '/changePassword',
  validate('changePassword'),
  exceptionHandler(auth.changePassword)
)

// Confirmar nueva contraseña
router.post(
  '/confirmNewPassword',
  validate('confirmNewPassword'),
  exceptionHandler(auth.confirmNewPassword)
)

// RefreshToken
router.post(
  '/refreshToken',
  validate('refreshToken'),
  exceptionHandler(auth.refreshToken)
)

// Crea usuarios
router.post(
  '/suppliers',
  validate('create'),
  verifyUser,
  exceptionHandler(auth.createSuppliers)
)

//Obtener la identidad de un usuario dado su token
router.post('/user', validate('user'), exceptionHandler(auth.verifyUser))
