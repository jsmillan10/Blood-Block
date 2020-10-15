# 2MatchBack-src

En esta carpeta se encuentran los microservicios en formato typescript para desarrollo

Al ejecutar `npm run dev` con el proyecto instalado y el archivo .env puesto en la carpeta principal correctamente, el proyecto correrá en su modo de desarrollo y se podrá desarrollar en typescript.

En caso de agregarse algún microservicio para ser consumido por el front-end (por ejemplo no cuenta el de expiración puesto que este corre 1 vez al día), este debe conectarse en el archivo routes.ts con su ruta correspondiente (todas las rutas tienen prefijo /api para diferenciar el Backend del Frontend al montarse en Cloudfront)
