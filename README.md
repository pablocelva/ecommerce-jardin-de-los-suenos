# Ecommerce Jardin de los Sueños

## Descripción

Este proyecto es una aplicación web que permite a los usuarios crear, ver, editar y eliminar productos, así como a los administradores gestionar el catálogo de productos. Además, permite a los usuarios realizar búsquedas y filtrar productos según categorías.

## Tecnologías

- React-Vite
- Ant Design
- Express
- Node.js
- PostgreSQL

## Estructura del proyecto

El proyecto está dividido en dos partes principales: el frontend y el backend.

### Frontend

El frontend está compuesto por dos páginas principales: la página de inicio y la página de perfil. La página de inicio es la página principal de la aplicación, y permite a los usuarios iniciar sesión y crear una cuenta. La página de perfil es una página privada que solo se puede acceder si se ha iniciado sesión. En la página de perfil, los usuarios pueden ver su información personal y sus favoritos, así como realizar búsquedas y filtrar productos según categorías.

### Backend

El backend está compuesto por una API RESTful que proporciona una interfaz para los usuarios y los administradores. La API proporciona rutas para crear, leer, actualizar y eliminar productos, así como gestionar el catálogo de productos. Además, la API permite a los usuarios realizar búsquedas y filtrar productos según categorías.

## Configuración del proyecto

Para configurar el proyecto, sigue los siguientes pasos:

1. Instale las dependencias necesarias:

```bash
npm install
```

2. Crea una base de datos PostgreSQL y una tabla llamada "productos" con los siguientes campos:

- id_producto (integer, primary key)
- nombre (text)
- precio (numeric)
- descripcion (text)
- foto (text)
- categoria_id (integer, foreign key referencia a la tabla "categorias")

3. Crea una base de datos PostgreSQL y una tabla llamada "categorias" con los siguientes campos:

- id_categoria (integer, primary key)
- nombre (text)

4. Configure las variables de entorno en el archivo ".env":

```bash
cp .env.example .env
```

5. Ejecute el servidor de desarrollo:

```bash
npm run dev
```
