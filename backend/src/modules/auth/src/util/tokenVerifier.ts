import jwt from 'jsonwebtoken'
import jwkToPem from 'jwk-to-pem'

type JWK = {
  alg: string
  e: string
  kid: string
  kty: string
  n: string
  use: string
}

let jsonWebKeys: JWK[] = []

export const initJWK = async (): Promise<JWK[]> => {
  const jwk = (await (await fetch(process.env.JWK_URL!)).json()).keys
  jsonWebKeys = jwk
  return jsonWebKeys
}

const _getJWK = async (): Promise<JWK[]> => {
  if (jsonWebKeys.length > 0) {
    return jsonWebKeys
  }
  return await initJWK()
}

export const validateToken = (token: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    _getJWK()
      .then((jwks) => {
        for (const jwk of jwks) {
          const pem = jwkToPem(jwk)
          jwt.verify(token, pem, { algorithms: ['RS256'] }, function (
            err,
            decoded
          ) {
            if (!err) {
              resolve(decoded)
              return
            }
          })
        }
        reject()
      })
      .catch(() => reject())
  })
}
