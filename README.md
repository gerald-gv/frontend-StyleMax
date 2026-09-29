# 👕 StyleMax - Web App

¡Bienvenido a **StyleMax**!  
Una aplicación web moderna de **comercio electrónico de ropa**, desarrollada con **Angular** y diseñada para ofrecer una experiencia completa de compra, gestión de productos y administración de la tienda.

La aplicación permite a los clientes explorar el catálogo, consultar el detalle de los productos, gestionar favoritos y carrito de compras, realizar pedidos y administrar su perfil. Además, cuenta con un **panel administrativo** para la gestión de productos, categorías, marcas, usuarios y pedidos.

---

## 🛠️ Tecnologías Utilizadas - Frontend

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

- 🅰️ **Angular 22** – Framework principal utilizado para construir la aplicación web, utilizando una arquitectura basada en componentes y funcionalidades independientes.
- 📘 **TypeScript** – Lenguaje utilizado para desarrollar la lógica de la aplicación, proporcionando tipado estático y mayor mantenibilidad.
- 🎨 **Tailwind CSS** – Framework de utilidades utilizado para crear una interfaz moderna, responsiva y adaptable a diferentes dispositivos.
- 🔄 **RxJS** – Librería utilizada para trabajar con operaciones asíncronas y comunicación reactiva dentro de la aplicación.
- 🧪 **Vitest** – Test runner utilizado para las pruebas unitarias del proyecto.

---

## 🛍️ Funcionalidades Principales

### 👤 Cliente

- 🔐 Registro e inicio de sesión.
- 👤 Gestión del perfil del usuario.
- 👕 Visualización del catálogo de productos.
- 🔎 Búsqueda y filtrado de productos.
- 🏷️ Navegación por categorías y marcas.
- 📦 Visualización del detalle de cada producto.
- ❤️ Gestión de productos favoritos.
- 🛒 Carrito de compras.
- 💳 Proceso de checkout.
- 📋 Consulta de pedidos realizados.
- 📍 Gestión de direcciones.
- 🔔 Notificaciones de acciones realizadas.
- 💰 Integración con el proceso de pago.
- ✅ Estados de pago: exitoso, pendiente y fallido.

### 🔧 Administración

La aplicación cuenta con un panel administrativo protegido mediante autenticación y autorización.

- 📊 Dashboard administrativo.
- 👕 Gestión de productos.
- 🏷️ Gestión de categorías.
- 🏢 Gestión de marcas.
- 👥 Gestión de usuarios.
- 📦 Gestión de pedidos.
- 📈 Visualización de estadísticas.
- 📝 Creación y edición de registros.
- 🗑️ Eliminación de registros.
- 🔒 Protección de rutas mediante guards.

---

## 🏗️ Arquitectura del Proyecto

El frontend utiliza una estructura organizada por funcionalidades para facilitar el mantenimiento y escalabilidad de la aplicación.

~~~text
src/
└── app/
    ├── core/
    │   ├── guards/
    │   ├── interceptors/
    │   ├── models/
    │   └── services/
    │
    ├── features/
    │   ├── admin/
    │   ├── auth/
    │   ├── carrito/
    │   ├── catalogo/
    │   ├── checkout/
    │   ├── home/
    │   ├── perfil/
    │   └── producto/
    │
    ├── layouts/
    │   ├── public-layout/
    │   └── admin-layout/
    │
    └── pages/
        └── not-found/
~~~

La separación entre `core`, `features` y `layouts` permite mantener las responsabilidades de cada parte de la aplicación organizadas y facilita la incorporación de nuevas funcionalidades.

---

## 🔐 Autenticación y Seguridad

StyleMax utiliza autenticación basada en **JWT**, integrada con el backend mediante un interceptor HTTP.

Las rutas protegidas utilizan guards para controlar el acceso:

- 🔐 **Auth Guard** – Protege las funcionalidades que requieren una sesión iniciada.
- 🛡️ **Admin Guard** – Restringe el acceso al panel administrativo a usuarios con los permisos correspondientes.
- 🔑 **HTTP Interceptor** – Gestiona el envío del token de autenticación en las solicitudes al backend.

---

## 🖥️ Backend - Tecnologías Utilizadas

![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

- ☕ **Java + Spring Boot** – Backend encargado de la lógica de negocio y exposición de la API REST.
- 🗄️ **MySQL** – Base de datos utilizada para almacenar la información de productos, usuarios, pedidos, categorías, marcas y demás entidades.
- 🔑 **JWT** – Sistema utilizado para la autenticación y autorización de usuarios.
- 💳 **Mercado Pago** – Integración utilizada para gestionar el proceso de pagos.

> ⚠️ Este repositorio corresponde principalmente al **Frontend de StyleMax**. La aplicación se comunica con un backend desarrollado independientemente mediante una API REST.

---

## 🌐 Integración con la API

El proyecto utiliza diferentes servicios Angular para comunicarse con el backend, entre ellos:

- `AuthService` – Autenticación y gestión de sesión.
- `ProductoService` – Consulta de productos.
- `CategoriaService` – Gestión de categorías.
- `MarcaService` – Gestión de marcas.
- `CarritoService` – Gestión del carrito.
- `FavoritoService` – Gestión de favoritos.
- `PedidoService` – Gestión de pedidos.
- `PagoService` – Comunicación relacionada con pagos.
- `PerfilService` – Gestión del perfil.
- `DireccionService` – Gestión de direcciones.
- `UsuarioService` – Gestión de información de usuarios.

La URL de la API se configura mediante los archivos de entorno de Angular:

~~~text
src/environments/environment.ts
src/environments/environment.development.ts
~~~

### Desarrollo

~~~text
http://localhost:8080/api
~~~

---

## 🚀 Instalación y ejecución

### 1. Clonar el repositorio

~~~bash
git clone <URL_DEL_REPOSITORIO>
~~~

### 2. Ingresar al proyecto

~~~bash
cd frontend-StyleMax
~~~

### 3. Instalar las dependencias

~~~bash
npm install
~~~

### 4. Ejecutar el servidor de desarrollo

~~~bash
npm start
~~~

También es posible utilizar:

~~~bash
ng serve
~~~

Una vez iniciado el servidor, la aplicación estará disponible en:

~~~text
http://localhost:4200/
~~~

> Para utilizar todas las funcionalidades de la aplicación durante el desarrollo, el backend debe estar disponible en `http://localhost:8080`.

---

## 🚀 Proyecto en Producción

🎉 El proyecto está desplegado y disponible para ser explorado.

👉 **Accedé desde aquí:** [Ir a StyleMax](https://stylemax.vercel.app/)
