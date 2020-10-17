// Constantes para diferenciar las respuestas de FIREBASE
export const OK = 'OK'

// Posibles errores en el inicio de sesión
export const ERROR_PASSWORD_INCORRECTO = 'auth/wrong-password'
export const ERROR_USUARIO_DESCONOCIDO = 'auth/user-not-found'
export const ERROR_MULTIPLES_INTENTOS = 'auth/too-many-requests'
export const ERROR = 'ERROR'

// Respuestas a los errores en el inicio de sesion
export const RESPUESTAS_ERROR_INICIO_SESION = {
    [ERROR_PASSWORD_INCORRECTO]: "La contraseña es incorrecta",
    [ERROR_USUARIO_DESCONOCIDO]: "El correo no se encuentra registrado",
    [ERROR_MULTIPLES_INTENTOS]: "Ha realizado múltiples intentos sin exito, intentelo más tarde",
    [ERROR]: "Lo sentimos, hubo un error con el inicio de sesión"
}

// Constantes para diferenciar los types en los reducers

// Constantes de los documentos de las secciones

// Constantes para realizar los llamados a las cloud functions

// Respuestas de la cloud function
export const FB_RES_EXITO = "exito"

// Constantes para los mensajes de error
