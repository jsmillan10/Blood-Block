import {
  body,
  oneOf,
  ValidationChain,
  header,
  validationResult,
} from 'express-validator'
import express from 'express'
import { Middleware } from 'express-validator/src/base'
export const validate = (
  method:
    | 'login'
    | 'changePassword'
    | 'confirmNewPassword'
    | 'refreshToken'
    | 'user'
    | 'create'
): Array<ValidationChain | Middleware> => {
  switch (method) {
    case 'login': {
      return [
        body('email', 'Debe ingresar un email válido')
          .exists()
          .isEmail()
          .withMessage('El formato del email no es válido'),
        body('password', 'Debe ingresar una contraseña válida')
          .exists()
          .matches(/.{8,}$/, 'i')
          .withMessage(
            'La contraseña contener mayúsculas, minúsculas, un número y ser de al menos 8 caracteres'
          ),
      ]
    }
    case 'changePassword': {
      return [
        body('email', 'Debe ingresar un email válido')
          .exists()
          .isEmail()
          .withMessage('El formato del email no es válido'),
      ]
    }
    case 'create': {
      return [
        body('email', 'Debe ingresar un email válido')
          .exists()
          .isEmail()
          .withMessage('El formato del email no es válido'),
        body('password', 'Debe ingresar una contraseña válida')
          .exists()
          .matches(/.{8,}$/, 'i')
          .withMessage('La contraseña ser de al menos 8 caracteres'),
        body('name', 'Debe ingresar un nombre').exists(),
        body('role', 'Debe ingresar un rol de usuario').exists(),
      ]
    }
    case 'confirmNewPassword': {
      return [
        body('email', 'Debe ingresar un email válido')
          .exists()
          .isEmail()
          .withMessage('El formato del email no es válido'),
        body('password', 'Debe ingresar una contraseña válida')
          .exists()
          .matches(/.{8,}$/, 'i')
          .withMessage(
            'La contraseña contener mayúsculas, minúsculas, un número y ser de al menos 8 caracteres'
          ),
        oneOf([
          [
            body('newPasswordRequired').custom((value) => value),
            body(
              'oldPassword',
              'Debe ingresar una contraseña antigua válida'
            ).exists(),
          ],
          [
            body('newPasswordRequired').custom((value) => !value),
            body('code', 'Debe ingresar el código de verificación').exists(),
          ],
        ]),
      ]
    }
    case 'refreshToken': {
      return [
        body('email', 'Debe ingresar un email válido')
          .exists()
          .isEmail()
          .withMessage('El formato del email no es válido'),
        body('refreshToken', 'Debe ingresar un token de refresco').exists(),
      ]
    }
    case 'user': {
      return [
        header('authorization', 'Debe ingresar un token válido').exists(),
        header(
          'company-nit',
          'Debe ingresar un NIT de compañía válido'
        ).exists(),
      ]
    }
  }
}

export const validationErrorHandler = (req): void => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw {
      message: 'Error de validación',
      statusCode: '400',
      data: errors.array(),
    }
  }
}

export const verifyUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  const headers = new Headers()
  headers.set('Authorization', req.headers['authorization'] as string)
  headers.set('Company-NIT', req.headers['company-nit'] as string)
  const response = await fetch(`${process.env.BACK_URL!}auth/user`, {
    method: 'POST',
    headers,
  })
  if (!response.ok) {
    res.status(401).json(await response.json())
    return
  }
  req.user = await response.json()
  next()
}
