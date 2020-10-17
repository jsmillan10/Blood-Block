import express from 'express'
export const router = express.Router()
import * as constants from './util/constants'
import * as queries from './queries'

import {
  sign,
  createRefreshToken,
  verifyPassword,
  hashPassword,
} from './util/tokenUtils'
import { validationErrorHandler } from './validator'
import { validationResult } from 'express-validator'
import { CustomError } from './util/errorHandler'

/**
 * Hace login
 * @param req.body.email email del usuario
 * @param req.body.password contraseña del usuario
 */
export const login = async function (
  req: express.Request,
  res: express.Response
): Promise<void> {
  const errors = validationResult(req)
  try {
    if (!errors.isEmpty()) {
      throw new CustomError(errors.array(), 422)
    }
    const email = req.body.email
    const password = req.body.password
    const user = await queries.findUser(req.body.email.toLowerCase())
    if (!user) {
      throw new CustomError('Email o contraseña incorrecta', 422)
    }

    const isEqual = await verifyPassword(password, user.password!)
    if (!isEqual) {
      throw new CustomError('Email o contraseña incorrecta', 422)
    }
    const token = sign(email, user)
    delete user.password
    res.status(200).json({
      token,
      tokenTimeout: 12,
      user,
      refreshToken: user.refreshToken,
      role: user.role,
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    throw err
  }
}

/**
 * Hace login
 * @param req.body.email email del usuario
 * @param req.body.password contraseña del usuario
 */
export const createUser = async function (
  req: express.Request,
  res: express.Response
): Promise<void> {
  const errors = validationResult(req)
  try {
    if (!errors.isEmpty()) {
      throw new CustomError(errors.array(), 422)
    }
    const email = req.body.email
    const password = await hashPassword(req.body.password)
    const role = req.body.role
    const name = req.body.name
    const refreshToken = await createRefreshToken()
    let user = await queries.findUser(email)
    if (user) {
      throw new CustomError('Ya hay un usuario con ese email', 422)
    }
    user = await queries.createUser({
      email,
      password,
      name,
      role,
      refreshToken,
    })
    const token = sign(email, user)
    delete user.password
    res.status(201).json({
      token,
      tokenTimeout: 12,
      user,
      refreshToken: user.refreshToken,
      role: user.role,
    })
  } catch (err) {
    console.log(err)
    if (!err.statusCode) {
      err.statusCode = 500
    }
    throw err
  }
}

/**
 * Refresca el token de un usuario
 * @param req.body.email email del usuario
 * @param req.body.refreshToken token de refresco para obtener el nuevo token
 */
export const refreshToken = async function (
  req: express.Request,
  res: express.Response
): Promise<void> {
  validationErrorHandler(req)
  try {
    const email = req.body.email
    const user = await queries.findUser(email)
    if (!user) {
      throw new CustomError('No se encontró el usuario', 404)
    }
    if (user.refreshToken !== req.body.refresToken) {
      throw new CustomError('El refreshToken no es válido', 404)
    }
    const token = sign(email, user)
    delete user.password

    res.status(201).json({
      token,
      tokenTimeout: 12,
      user,
      refreshToken: user.refreshToken,
      role: user.role,
    })
  } catch (e) {
    console.log(e)
    res.status(constants.STATUS_UNAUTHORIZED).send(e)
  }
}
