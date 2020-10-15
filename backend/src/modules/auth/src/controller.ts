import express from 'express'
export const router = express.Router()
import * as constants from './util/constants'
import * as queries from './queries'
import * as tokenVerifier from './util/tokenVerifier'
import {
  adaptErrorMessage,
  loginCognito,
  forgotPasswordCognito,
  confirmNewPasswordCognito,
  completeChallengeCognito,
  refreshTokenCognito,
  resetUser,
  createUserCognito,
} from './util/cognito'
import { validationErrorHandler } from './validator'

/**
 * Hace login
 * @param req.body.email email del usuario
 * @param req.body.password contraseña del usuario
 */
export const login = async function (
  req: express.Request,
  res: express.Response
): Promise<void> {
  validationErrorHandler(req)
  try {
    const login = await loginCognito(
      req.body.email.toLowerCase(),
      req.body.password
    )
    const user = await queries.findUser(req.body.email.toLowerCase())
    if (!user) {
      throw {
        message: 'El usuario no se encuentar en el sistema. Contacte a soporte',
      }
    }
    const company = await user.companies.find(
      (company) => company.NITRetailer === req.headers['company-nit']
    )
    if (!company) {
      throw {
        message: 'El usuario no pertenece a esta compañía',
      }
    }
    res.send({ ...login, role: company.role })
  } catch (e) {
    console.log(e)
    const newError = adaptErrorMessage(e)
    if (newError.action && newError.action === 'RESET') {
      try {
        await resetUser(req.body.email.toLowerCase())
      } catch (e) {
        console.log(e)
        res
          .status(constants.STATUS_UNAUTHORIZED)
          .send({ message: 'Ha ocurrido un error, intentalo más tarde' })
        return
      }
    }
    res.status(constants.STATUS_UNAUTHORIZED).send(newError)
  }
}

/**
 * Solicita cambio de contraseña para un usuario
 * @param req.body.email email del usuario
 */
export const changePassword = async function (
  req: express.Request,
  res: express.Response
): Promise<void> {
  validationErrorHandler(req)
  try {
    const login = await forgotPasswordCognito(req.body.email.toLowerCase())
    res.send(login)
  } catch (e) {
    console.log(e)
    const newError = adaptErrorMessage(e)
    res.status(constants.STATUS_UNAUTHORIZED).send(newError)
  }
}

/**
 * Confirma el cambio de contraseña
 * @param req.body.email email del usuario
 * @param req.body.password contraseña nueva del usuario
 * @param req.body.newPasswordRequired Indica si se debe cambiar la contraseña por primera vez
 * @param req.body.oldPassword contraseña antigua del usuario, requerida solo si se debe cambiar la contraseña por primera vez
 * @param req.body.code Código de verificación enviado al email, solo se usa si no se debe cambiar la contraseña por primera vez
 */
export const confirmNewPassword = async function (
  req: express.Request,
  res: express.Response
): Promise<void> {
  validationErrorHandler(req)
  try {
    let login
    if (req.body.newPasswordRequired) {
      login = await completeChallengeCognito(
        req.body.email.toLowerCase(),
        req.body.oldPassword,
        req.body.password
      )
    } else {
      login = await confirmNewPasswordCognito(
        req.body.email.toLowerCase(),
        req.body.password,
        req.body.code
      )
    }
    const user = await queries.findUser(req.body.email.toLowerCase())
    if (!user) {
      throw new Error('No se encuentra en el sistema')
    }
    const company = await user.companies.find(
      (company) => company.NITRetailer === req.headers['company-nit']
    )
    if (!company) {
      throw new Error('No se encuentra en el sistema')
    }
    res.send({ ...login, role: company.role })
  } catch (e) {
    console.log(e)
    const newError = adaptErrorMessage(e)
    res.status(constants.STATUS_UNAUTHORIZED).send(newError)
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
    const login = await refreshTokenCognito(
      req.body.email.toLowerCase(),
      req.body.refreshToken
    )
    res.send(login)
  } catch (e) {
    console.log(e)
    const newError = adaptErrorMessage(e)
    res.status(constants.STATUS_UNAUTHORIZED).send(newError)
  }
}

/**
 * Verifica la existencia de un usuario y devuelve su rol y nit
 * @param header.Company-NIT Indica el NIT de la compañía retailer, dado que un usuario puede hacer parte de múltiples compañías con diferentes roles
 * @param header.authorization Token del usuario dado por cognito
 */
export const verifyUser = async function (
  req: express.Request,
  res: express.Response
): Promise<void> {
  validationErrorHandler(req)
  const token = req.headers['authorization']

  let userData
  try {
    userData = await tokenVerifier.validateToken(token!)
  } catch (err) {
    throw { message: 'Token inválido', statusCode: 401 }
  }

  let user = await queries.findUser(userData.email.toLowerCase())

  if (!user) {
    throw new Error('No se encuentra en el sistema')
  }

  user = user.toObject()

  const company = await user!.companies.find(
    (company) => company.NITRetailer === req.headers['company-nit']
  )
  if (!company) {
    throw new Error('No se encuentra en el sistema')
  }

  res.send({
    email: userData.email,
    role: company.role,
    nit: company.NIT,
  })
}

/**
 * Verifica la existencia de un usuario y devuelve su rol y nit
 * @param users Lista de usuarios a agregar al administrador
 */
export const createSuppliers = async function (
  req: express.Request,
  res: express.Response
): Promise<void> {
  validationErrorHandler(req)
  let transaction
  try {
    if (req.user!.role !== 'admin') {
      throw {
        message: 'Se debe ser administrador para utilizar esta función',
        statusCode: constants.STATUS_UNAUTHORIZED,
      }
    }
    const suppliers = req.body.users
    const suppliersMap = new Map()
    const emails: string[] = []
    //Se meten los usuarios a un MAP para eliminar repetidos
    for (const supplier of suppliers) {
      suppliersMap.set(supplier.email, supplier)
      emails.push(supplier.email)
    }
    transaction = await queries.getTransaction()

    const newSupplierCompanies = new Map()
    //Para todos los usuarios que se envían
    for (const [, supplier] of suppliersMap.entries()) {
      const supplierCompany = await queries.getSupplierCompanyByNIT(
        supplier.NIT
      )
      //Si existe la compañía proveedora, se guarda en un mapa (para no repetir) la información de las nuevas compañías
      if (!supplierCompany) {
        newSupplierCompanies.set(supplier.NIT, {
          name: supplier.companyName,
          NIT: supplier.NIT,
        })
      }
    }
    if (newSupplierCompanies.size > 0) {
      //Se crean todas las compañías proveedoras no existentes
      await queries.createSupplierCompanies(
        Array.from(newSupplierCompanies.values()),
        transaction
      )
    }

    //Se encuentran todos los usuarios existentes
    const users = await queries.findUsers(emails)
    //Para cada uno de los usuarios existentes, se le agrega la empresa retailer
    for (const user of users) {
      const info = suppliersMap.get(user.email)
      let company
      company = user.companies.find(
        (company) => company.NITRetailer === req.headers['company-nit']
      )
      // Si no tiene de compañía al pagador, se le agrega
      if (!company) {
        company = {
          NIT: info.NIT,
          name: info.companyName,
          role: 'supplier',
          NITRetailer: req.headers['company-nit'],
        }
        user.companies.push(company)
      } else {
        // Si sí tiene de compañía al pagador, se le actualiza el NIT y el nombre
        company.NIT = info.NIT
        company.name = info.companyName
      }
      //Se sacan los existentes del arreglo
      suppliersMap.delete(user.email)
    }
    //Se actualizan esos usuarios existenes
    await queries.updateUsers(users, transaction)

    //Los que quedan son usuarios no existentes
    const promiseUsers: Promise<
      | AWS.CognitoIdentityServiceProvider.AdminCreateUserResponse
      | AWS.CognitoIdentityServiceProvider.AdminGetUserResponse
    >[] = []
    const suppliersToAdd: {
      email: string
      companies: {
        NIT: string
        name: string
        role: 'supplier'
        NITRetailer: string
      }[]
    }[] = []
    for (const [, supplier] of suppliersMap.entries()) {
      //Se ingresan a cognito
      promiseUsers.push(createUserCognito(supplier.email.toLowerCase()))
      suppliersToAdd.push({
        email: supplier.email.toLowerCase(),
        companies: [
          {
            NIT: supplier.NIT,
            name: supplier.companyName,
            role: 'supplier',
            NITRetailer: req.headers['company-nit'] as string,
          },
        ],
      })
    }
    //Primero se crean todos los usuarios en la base de datos
    const usersCreated = await queries.createUsers(suppliersToAdd, transaction)

    // Una vez creados, ahora sí se ingresan a cognito (o se verifica que existan)
    await Promise.all(promiseUsers)
    await queries.commit(transaction)
    transaction = null
    res.send(usersCreated)
  } catch (e) {
    if (transaction) {
      await queries.rollback(transaction)
    }
    console.log(e)
    if (!e.statusCode) {
      throw new Error('Ha ocurrido un problema subiendo los proveedores')
    } else {
      throw e
    }
  }
}
