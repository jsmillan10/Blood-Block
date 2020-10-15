# Instalación

Para instalar el proyecto para un nuevo retailer se debe:

- Crear el usuario de cognito de los usuarios que vayan a utilizar la plataforma como retailer
- Cambiar el NIT retailer por el NIT correspondiente en el front-end, hacer build del front-end y montarlo en el S3
- Realizar la conexión con el Cloudfront del S3
- Agregar al modelo retailerCompany en mongoDB la información de la compañía con NIT como el NIT correspondiente
- Agregar al modelo users en mongoDB la información de los usuarios administradores con NITRetailer y NIT como el NIT correspondiente
