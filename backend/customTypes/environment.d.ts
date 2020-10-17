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
      BACK_URL: string
      NODE_ENV: 'development' | 'production' | 'verifier' | 'email'
      PRIVATE_KEY: string
      PUBLIC_KEY: string
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
