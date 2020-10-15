# 2MatchBack

Repositorio para estructurar el Back-end de la aplicación 2Match. Incluye todos los microservicios montados así como un Mock para simular algunas cosas

## Colaboradores

- Escuela Digital de Innovación 2020-1

  [GitHub](https://github.com/EDI-carvajal)

Desplegado en AWS en ECS

## Descripción del proyecto

El proyecto se divide en una carpeta Mock, donde se incluyen todos los servicios simulados, tales como una función para cargar facturas aleatorias, ofertas alteatorias, etc. Y una carpeta src donde se encuentran los microservicios del proyecto. Cada microservicio se encuentra en la carpeta Modules dentro de src.

Para más información revisar el README.md de la carpeta dist/modules

El proyecto debe cumplir con los estándares de eslint y prettier para typescript para que se pueda ejecutar. Se recomienda para esto utilizar vscode, instalar las extensiones de vscode de eslint y prettier y dejar prettier como el "default formatting"
(Click derecho, format document with, configure default formatter, prettier)

## Tecnologías base

Se está utilizando NodeJS con Typescript para la construcción de microservicios. En la carpeta dist quedan los archivos .js generados con base en los archivos .ts. Dentro de dist, cada microservicio cuenta con su propio Dockerfile y package.json para luego poder ser subido (cada modulo con su js transpilado) de manera independiente

### Escogencia de tecnologías

En este video se observa una comparación de NodeJS vs SpringBoot: https://www.youtube.com/watch?v=Fbhhc4jtGW4&t=108.
NodeJS es más rápido de escribir y más performante para servicios que se encarguen de hacer consultas a la base de datos de manera asíncrona, lo cual es el core de la aplicación.

Se escogió la base de datos no relacional MongoDB por su velocidad de transmisión de datos, sus múltiples funcionalidades de filtrado y queries y su bajo costo comparado a otras bases de datos no relacionales. Así mismo se escogió Mongoose para estructurar mejor los modelos no relacionales y facilitar las queries.

Así mismo, utiliza eslint y prettier para darle un formato consistente al código y coherente con los estandares de JS y Typescript

Este proyecto incluye otras librerías que pueden ser observadas en cada package.json respectivamente

## Instrucciones para ejecutar

### Requisitos

- **Node JS**

Verificar que nodeJS está instalado ejecutando "node -v" en la terminal o cmd. Puede ser descargado de https://nodejs.org/ (versión LTS)

Instalar las librerías globales necesarias. Para eso se debe ejecutar el siguiente comando en la terminal con permisos de administrador para sistemas UNIX.

```
npm install -g typescript prettier eslint
```

Posteriormente se debe ejecutar en la carpeta principal

```
npm install
```

### Correr el proyecto en desarrollo

Tener un archivo .env en la carpeta principal con la información de las variables de entorno requeridas, estas son:

- AWS_REGION: Región de aws en la cual se monta la arquitectura, por ejemplo: `us-east-1`
- BACK_URL: URL del balanceador de carga o backend montado de manera monolítica, se utiliza principalmente para autenticar a un usuario
- COGNITO_AWS_ACCESS_KEY: Access Key del rol que tiene permisos de crear usuarios y reiniciar contraseñas en pool de cognito
- COGNITO_AWS_SECRET_KEY: Secret Key del rol que tiene permisos de crear usuarios en pool de cognito
- JWK_URL: URL del pool de cognito para verificar la identidad de un usuario, se verifica utilizando el id_token
- EMAIL_AWS_ACCESS_KEY: Access Key del rol que tiene permisos de envío de correos
- EMAIL_AWS_SECRET_KEY: Secret Key del rol que tiene permisos de envío de correos
- DB_HOST: IP o hostname de la base de datos MongoDB
- BUCKET_NAME: Nombre del bucket en el cual se encuentran alojados los archivos estáticos de la aplicación
- S3_ACCESS_KEY: Access Key del rol que tiene permisos de subir archivos en S3
- S3_SECRET_KEY: Secret Key del rol que tiene permisos de subir archivos en S3
- SFTP_HOST: HOST o IP del servicio SFTP de carga de facturas
- SFTP_USERNAME: username del servicio SFTP de carga de facturas
- SFTP_PASSWORD: contraseña del servicio SFTP de carga de facturas
- SFTP_PATH: Ruta donde se encuentra el archivo a ser leído por el servicio SFTP de carga de facturas

En la carpeta principal se debe ejecutar

```
npm run dev
```

### Correr el proyecto en producción

#### Prerrequisitos:

- Tener montada la infraestructura en AWS en la cuenta que se vaya a utilizar

- Docker toolbox o docker nativo en caso de usar linux

- Tener instalado el CLI de AWS para el sistema operativo correspondiente

https://aws.amazon.com/es/cli/

Una vez instalado se debe iniciar sesión en la cuenta correspondiente en la cual se vaya a desplegar la arquitectura. Para esto se debe ejecutar `aws configure` e introducir credenciales de algún rol en la cuenta que se vaya a utilizar con permisos de ECR

Se debe correr `npm run build` en la carpeta principal

Una vez hecho login, se ejecuta deploy.sh en la carpeta principal del proyecto, este archivo crea los contenedores de docker y los sube al repositorio correspondiente.

Dentro de la carpeta dist, dentro de cada una de las carpetas de cada módulo se encuentra un archivo Dockerfile. Este archivo es el que se utiliza para construir la imagen que posteriormente se subirá a AWS con ECS. Para más información de la arquitectura se puede observar un diagrama de componentes en el archivo componentes.png

Para más información general consultar la carpeta docs

En caso de dudas o necesidad de clarificaciones adicionales conctactar a Carlos Mario Sarmiento Pinilla. De la quinta escuela digital de innovación 2020-1
