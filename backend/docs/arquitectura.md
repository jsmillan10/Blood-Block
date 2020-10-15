# Arquitectura

El orden recomendado para montar la arquitectura en una cuenta de AWS es el siguiente:

### Roles

Se necesitan al menos 4 roles pero se puede tener uno solo con los 4 permisos necesarios, estos son:

- Permiso de administrador de pool de cognito
- Permiso de envío de correos de SES
- Permiso de push en repositorios ECR
- Permiso de push en buckets S3

### Cognito

Crear un pool donde se guardan los usuarios de la plataforma. Se debe indicar como necesario únicamente el email. Además se deben poner los templates de correos de creación de usuario y código de cambio de contraseña. Estos correos están en `src/modules/emails/src/util/templates` en las carpetas registroExitoso y codigoVerificación

### ECS

Crear un cluster ECS y los servicios correspondientes para cada uno de los microservicios (cada una de las carpetas dentro de la carpeta dist).

### Capacity provider y autoescaling group

Crear un autoescaling group y un capacity provider correspondiente para el cluster. En el momento de crear la instancia de EC2 incluir lo siguiente en el user data

<code>#!/bin/bash
echo "ECS_CLUSTER=your_cluster_name" > /etc/ecs/ecs.config</code>

### Balanceador de carga y target groups

Crear un application load balancer y múltiples target groups para cada uno de microservicios, excepto para el de expirationVerifier,dailyEmails y invoice-sftp. Los target groups deben tener los mismos puertos que los microservicios correspondientes. En el dockerFile está la información del puerto necesario para cada uno.
Se deben crear los listeners en el balanceador de carga para asignarle los target groups, la información de cada ruta se encuentra a continuación:

- auth: /api/auth\*
- companies: /api/companies\*
- emails: /api/emails\*
- history: /api/history\*
- offersBags: /api/offersBags\*
- invoices: /api/invoices\*
- offers: /api/offers\*
- bestOption: /api/bestOption\*
- tradingBags: /api/tradingBags\*

Se debe procurar dejar offersBags con mayor prioridad que offers puesto que sino en todos los casos la ruta de offers se seleccionará primero al enviar una petición a offersBags

### S3

Se debe crear 2 buckets en s3, ambos con permisos públicos de lectura. Uno para almacenar la página web estática y otro para almacenar los datos que se vayan guardando tales como logos de las empresas

### EC2 MongoDB

Crear una instancia de EC2 a la cual se le instala mongoDB community edition. Se debe crear esta instancia como una instancia réplica primaria, las credenciales deben ser las mismas que se configuran en las variables de entorno

### Tasks

Crear las tasks en modo EC2 para cada uno de los microservicios en el cluster ecs. En las tasks se deben incluir las variables de entorno correspondientes, las necesarias son (separadas por coma):

- auth: AWS_REGION,BACK_URL,COGNITO_AWS_ACCESS_KEY,COGNITO_AWS_SECRET_KEY,DB_HOST,JWK_URL
- companies: AWS_REGION,BACK_URL,BUCKET_NAME,DB_HOST,S3_ACCESS_KEY,S3_SECRET_KEY
- dailyEmails: AWS_REGION,DB_HOST,EMAIL_AWS_ACCESS_KEY,EMAIL_AWS_SECRET_KEY
- emails: AWS_REGION,BACK_URL,DB_HOST,EMAIL_AWS_ACCESS_KEY,EMAIL_AWS_SECRET_KEY
- history: BACK_URL,DB_HOST
- offersBags: BACK_URL,DB_HOST
- invoices: BACK_URL,DB_HOST
- offers: BACK_URL,DB_HOST
- bestOption:APP_ENV,BACK_URL,DB_HOST
- tradingBags: BACK_URL,DB_HOST
- expirationVerifier: DB_HOST
- invoicesLoader: DB_HOST,SFTP_HOST,SFTP_USERNAME,SFTP_PASSWORD

La explicación de las variables de entorno se encuentra en README.md en la carpeta principal

Nuevamente la información del puerto debe estar asociada con el puerto expuesto en docker

### Servicios

Crear los servicios para todos excepto para el de expirationVerifier,dailyEmails y invoices-loader. Estos servicios deben estar vinculados con la task correspondiente y con el target group correspondiente. Además se deben crear 2 reglas de autoescaling: Una para memoria y otra para CPU, se recomienda asignar ambas como target tracking de 40%

### CloudFront

Crear un cloudfront y conectarlo con el balanceador de carga para rutas que empiecen con /api/\*. Para el resto de las rutas se deben redireccionar al S3 con la página web. En caso de errores 403 se debe redireccionar también al S3

Finalmente el cloudfront se debe conectar con el dominio correspondiente para que se pueda acceder desde este a toda la arquitectura. Se recomienda no realizar cache de más de 1 minuto para que la información de la página web no tarde en llegar
