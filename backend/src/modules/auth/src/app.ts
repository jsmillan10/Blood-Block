import express from 'express'
import cors from 'cors'
// Este polyfill se usa para la librería de cognito que lo requiere y para enviar peticiones http
require('cross-fetch/polyfill')
import bodyParser from 'body-parser'
import { initDB } from './util/mongoose'
import { router } from './routes'
import { exceptionMiddleware } from './util/errorHandler'

const app = express()

// Cors para permitir métodos
app.use(cors())
// BodyParser para recibir post
app.use(bodyParser.json())

app.use('/api/auth', router)

//Para informarle al balanceador de carga que el servicio está saludable
app.get('/health', function (req, res) {
  res.sendStatus(200)
})

router.use(exceptionMiddleware)

const PORT = process.env.PORT || 8082
initDB()

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`)
})
