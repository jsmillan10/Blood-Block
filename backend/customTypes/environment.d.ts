// custom_typings/express/index.d.ts
export interface AuthUser {
  email: string
  role: string
  nit: string
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string
      JWK_URL: string
      BACK_URL: string
      NODE_ENV: 'development' | 'production' | 'verifier' | 'email'
      S3_ACCESS_KEY: string
      S3_SECRET_KEY: string
      AWS_REGION: string
      BUCKET_NAME: string
      COGNITO_AWS_ACCESS_KEY: string
      COGNITO_AWS_SECRET_KEY: string
    }
  }
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
  interface AuthUser {
    email: string
    role: string
    nit: string
  }
}

// custom_typings/express/index.d.ts
declare namespace Express {
  interface Request {
    user?: AuthUser
  }
}

// place-to-extend-enum.ts
declare module 'express-joi-validation' {
  export enum ContainerTypes {
    User = 'user',
  }
}
// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
