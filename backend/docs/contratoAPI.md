#### **1 Rutas Públicas**

#### **1.1. Ver Productos**
- **GET** `/productos`
- **Descripción:** Devuelve una lista de todos los productos disponibles en la tienda.
- **Respuesta exitosa:** `200 OK`
  ```json
  [
    {
      "id": 1,
      "nombre": "Monstera Deliciosa",
      "descripcion": "Planta tropical ideal para interiores.",
      "precio": 25.99,
      "stock": 100,
      "categoria": "interior",
      "imagenes": ["https://cdn.plantify.com/monstera1.jpg"]
    },
    {
      "id": 2,
      "nombre": "Cactus",
      "descripcion": "Planta resistente al sol.",
      "precio": 15.50,
      "stock": 50,
      "categoria": "exterior",
      "imagenes": ["https://cdn.plantify.com/cactus1.jpg"]
    }
  ]
  ```

#### **1.2. Ver Detalles de un Producto**
- **GET** `/productos/{id}`
- **Descripción:** Devuelve los detalles de un producto en particular.
- **Respuesta exitosa:** `200 OK`
  ```json
  {
    "id": 1,
    "nombre": "Monstera Deliciosa",
    "descripcion": "Planta tropical ideal para interiores.",
    "precio": 25.99,
    "stock": 100,
    "categoria": "interior",
    "imagenes": ["https://cdn.plantify.com/monstera1.jpg"],
    "tags": ["interior", "decorativa", "tropical"]
  }
  ```
- **Errores:**
  - Producto no encontrado: `404 Not Found`
    ```json
    {
      "error": "Producto no encontrado"
    }
    ```

#### **1.3. Iniciar Sesión (Login)**
- **POST** `/auth/login`
- **Descripción:** Permite a un usuario autenticarse en el sistema.
- **Body:**
  ```json
  {
    "email": "usuario@example.com",
    "password": "password123"
  }
  ```
- **Respuesta exitosa:** `200 OK`
  ```json
  {
    "token": "jwt_token_aqui"
  }
  ```
- **Errores:**
  - Datos incorrectos (email o password): `401 Unauthorized`
    ```json
    {
      "error": "Correo electrónico o contraseña incorrectos"
    }
    ```
  - Campos faltantes: `400 Bad Request`
    ```json
    {
      "error": "El correo electrónico y la contraseña son obligatorios"
    }
    ```

#### **1.4. Registro de Usuarios**
- **POST** `/auth/registro`
- **Descripción:** Permite a un nuevo usuario registrarse en el sistema.
- **Body:**
  ```json
  {
    "email": "nuevo_usuario@example.com",
    "password": "password123",
    "nombre": "Nuevo Usuario",
    "telefono": "123456789"
  }
  ```
- **Respuesta exitosa:** `201 Created`
  ```json
  {
    "message": "Usuario registrado con éxito"
  }
  ```
- **Errores:**
  - Campos faltantes: `400 Bad Request`
    ```json
    {
      "error": "Todos los campos son obligatorios"
    }
    ```
  - Correo electrónico ya registrado: `409 Conflict`
    ```json
    {
      "error": "El correo electrónico ya está registrado"
    }
    ```

---

### **2. Rutas Privadas**

#### **2.1. Carrito de Compras**
- **GET** `/pedidos/pedido/{id_compra}`
- **Descripción:** Devuelve los productos que el cliente ha agregado a su carrito.
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Respuesta exitosa:** `200 OK`
  ```json
  {
    "carrito": [
      {
        "productoId": 1,
        "nombre": "Monstera Deliciosa",
        "cantidad": 2,
        "precio": 25.99
      }
    ]
  }
  ```

#### **2.2. Checkout**
- **POST** `/pedidos`
- **Descripción:** Permite realizar la compra del carrito y generar una nueva orden.
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Body:**
  ```json
  {
    "direccion": "Calle Ficticia 123",
    "metodoPago": "tarjeta_credito"
  }
  ```
- **Respuesta exitosa:** `200 OK`
  ```json
  {
    "ordenId": 101,
    "total": 51.98,
    "estado": "pendiente"
  }
  ```

#### **2.3. Historial de Compras del Cliente**
- **GET** `/pedidos/usuario/{id_usuario}`
- **Descripción:** Devuelve el historial de compras del cliente autenticado.
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Respuesta exitosa:** `200 OK`
  ```json
  {
    "usuarioId": 1,
    "compras": [
      {
        "ordenId": 101,
        "fecha": "2025-01-20T15:30:00Z",
        "total": 51.98,
        "estado": "completada",
        "productos": [
          {
            "id": 1,
            "nombre": "Monstera Deliciosa",
            "cantidad": 2,
            "precio": 25.99
          }
        ]
      }
    ]
  }
  ```

---

### **3. Rutas de Admin**

#### **3.1. Subir Productos**
- **POST** `/productos`
- **Descripción:** Permite al administrador subir un nuevo producto a la tienda.
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Body:**
  ```json
  {
    "nombre": "Orquídea",
    "descripcion": "Hermosa planta tropical.",
    "precio": 35.00,
    "stock": 100,
    "categoria": "interior",
    "dimensiones": "20x20x40 cm",
    "imagenes": [
      "https://cdn.plantify.com/orquidea1.jpg",
      "https://cdn.plantify.com/orquidea2.jpg"
    ],
    "tags": ["interior", "decorativa", "floral"]
  }
  ```
- **Respuesta exitosa:** `201 Created`
  ```json
  {
    "message": "Producto creado con éxito",
    "productoId": 3
  }
  ```
- **Errores:**
  - Permisos insuficientes: `403 Forbidden`
    ```json
    {
      "error": "Permisos insuficientes"
    }
    ```
  - Datos incompletos o inválidos: `400 Bad Request`
    ```json
    {
      "error": "Todos los campos son obligatorios"
    }
    ```

#### **3.2. Historial de Ventas**
- **GET** `/pedidos/`
- **Descripción:** Devuelve un historial de ventas con información de todas las órdenes completadas.
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Respuesta exitosa:** `200 OK`
  ```json
  {
    "ventas": [
      {
        "ordenId": 101,
        "fecha": "2025-01-20T15:30:00Z",
        "cliente": {
          "id": 1,
          "nombre": "Pablo"
        },
        "total": 51.98,
        "productos": [
          {
            "id": 1,
            "nombre": "Monstera Deliciosa",
            "cantidad": 2,
            "precio": 25.99
          }
        ]
      }
    ]
  }