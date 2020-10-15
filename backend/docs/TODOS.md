Entre las principales tareas pendientes se encuentran:

### Terraform

- Agregar las tareas de expirationVerifier con un `cron(5 5 * * ? *)` para que se ejecute a media noche todos los días

- Agregar las tareas de dailyEmail con un `cron(12 5 * * ? *)` para que se ejecute todos los días a las 7am

- Agregar el CloudFront y su conexión con el s3, el balanceador de carga y el dominio

- Agregar el resto de autoescalamiento de servicios (service-autoescaling): uno de CPU y uno de Memoria por cada uno de los servicios

- Agregar el pool de cognito

### Estructura BackEnd

- Crear interfaces correspondientes para cada uno de los controladores y queries de manera que se puedan reemplazar por otros. Por ejemplo si se reemplaza MongoDB por otro tipo de base de datos

- Acoplar ExpressValidator y verifyUser con typescript de manera que en el controlador se sepa cuales variables están definidas y no se tenga que escribir siempre `req.user!`

### BackEnd

- Abstraer funcionalidades comunes en otras funciones, similar a como está el parseFilters del controlador de ofertas

- Implementar pruebas unitarias para cada una de las queries y de las funciones de los controladores

- Implementar las otras funcionalidades descritas en funcionalidades siguientes recomendadas

- En vez de usar números para los estados de oferta, factura, bolsas y etc; crear una enumeración con texto y valores para que sea más legible

- Crear websockets para actualizar la data en tiempo real
