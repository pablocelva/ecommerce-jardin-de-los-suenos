import type { OpenAPI } from "./openapi.types.js";

export const swaggerSchemas: Record<string, OpenAPI.SchemaObject> = {
  UsuarioPublico: {
    type: "object",
    properties: {
      id_usuario: { type: "integer", example: 1 },
      email: { type: "string", example: "cliente@example.com" },
      nombre: { type: "string", example: "Juan" },
      apellido: { type: "string", example: "Pérez" },
      direccion: { type: "string", example: "Calle Falsa 123" },
      telefono: { type: "string", example: "+56912345678" },
      rol: { type: "string", enum: ["admin", "cliente"], example: "cliente" },
    },
    required: ["id_usuario", "email", "nombre", "apellido", "direccion", "telefono", "rol"],
  },
  LoginRequest: {
    type: "object",
    properties: {
      email: { type: "string", format: "email", example: "cliente@example.com" },
      password: { type: "string", example: "miPassword123" },
    },
    required: ["email", "password"],
  },
  RegisterRequest: {
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string" },
      nombre: { type: "string" },
      apellido: { type: "string" },
      direccion: { type: "string" },
      telefono: { type: "string" },
    },
    required: ["email", "password", "nombre", "apellido", "direccion", "telefono"],
  },
  AuthResponse: {
    type: "object",
    properties: {
      token: { type: "string" },
      usuario: { $ref: "#/components/schemas/UsuarioPublico" },
    },
    required: ["token", "usuario"],
  },
  Producto: {
    type: "object",
    properties: {
      id_producto: { type: "integer", example: 1 },
      nombre_producto: { type: "string", example: "Monstera Deliciosa" },
      descripcion: { type: "string", example: "Planta de interior popular." },
      precio: { type: "number", format: "float", example: 25.99 },
      stock: { type: "integer", example: 10 },
      fecha_creacion: { type: "string", format: "date-time" },
    },
    required: ["id_producto", "nombre_producto", "descripcion", "precio", "stock"],
  },
  ProductoInput: {
    type: "object",
    properties: {
      nombre_producto: { type: "string" },
      descripcion: { type: "string" },
      precio: { type: "number", minimum: 0 },
      stock: { type: "integer", minimum: 0 },
    },
    required: ["nombre_producto", "descripcion", "precio", "stock"],
  },
  Categoria: {
    type: "object",
    properties: {
      id_categoria: { type: "integer", example: 1 },
      nombre_categoria: { type: "string", example: "Plantas de Interior" },
    },
    required: ["id_categoria", "nombre_categoria"],
  },
  ImagenProducto: {
    type: "object",
    properties: {
      id_imagen: { type: "integer", example: 1 },
      id_producto: { type: "integer", example: 1 },
      url: { type: "string", format: "uri" },
    },
    required: ["id_producto", "url"],
  },
  OrderDetail: {
    type: "object",
    properties: {
      id_producto: { type: "integer" },
      nombre_producto: { type: "string" },
      cantidad: { type: "integer" },
      precio_unitario: { type: "number" },
      subtotal: { type: "number" },
    },
    required: ["id_producto", "nombre_producto", "cantidad", "precio_unitario"],
  },
  Pedido: {
    type: "object",
    properties: {
      id_compra: { type: "integer", example: 1 },
      id_usuario: { type: "integer", example: 2 },
      precio_total: { type: "number", example: 64.97 },
      detalle: {
        type: "array",
        items: { $ref: "#/components/schemas/OrderDetail" },
      },
      direccion: { type: "string" },
      estado: {
        type: "string",
        enum: ["pending", "shipped", "delivered", "cancelled"],
      },
      fecha_compra: { type: "string", format: "date-time" },
      fecha_envio: { type: "string", format: "date-time", nullable: true },
    },
    required: ["id_compra", "precio_total", "detalle", "direccion", "estado"],
  },
  CreateOrderRequest: {
    type: "object",
    properties: {
      id_usuario: { type: "integer" },
      nombre_cliente: { type: "string" },
      email_cliente: { type: "string", format: "email" },
      detalle: {
        type: "array",
        items: { $ref: "#/components/schemas/OrderDetail" },
      },
      total: { type: "number", minimum: 0 },
      estado: {
        type: "string",
        enum: ["pending", "shipped", "delivered", "cancelled"],
        default: "pending",
      },
      direccion: { type: "string" },
    },
    required: [
      "id_usuario",
      "nombre_cliente",
      "email_cliente",
      "detalle",
      "total",
      "direccion",
    ],
  },
  ApiError: {
    type: "object",
    properties: {
      id: { type: "string", example: "errorValidacion" },
      message: { type: "string", example: "Formato de correo inválido" },
      description: { type: "string" },
    },
    required: ["id", "message", "description"],
  },
};

const bearerSecurity: OpenAPI.SecurityRequirementObject[] = [
  { bearerAuth: [] },
];

export const swaggerPaths: OpenAPI.PathsObject = {
  "/api/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Iniciar sesión",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/LoginRequest" },
          },
        },
      },
      responses: {
        "200": {
          description: "Login exitoso",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthResponse" },
            },
          },
        },
        "400": {
          description: "Credenciales inválidas o datos incorrectos",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiError" },
            },
          },
        },
      },
    },
  },
  "/api/auth/registro": {
    post: {
      tags: ["Auth"],
      summary: "Registrar usuario",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/RegisterRequest" },
          },
        },
      },
      responses: {
        "201": {
          description: "Usuario registrado",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthResponse" },
            },
          },
        },
        "409": {
          description: "Correo ya registrado",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiError" },
            },
          },
        },
      },
    },
  },
  "/api/auth/usuarios/": {
    get: {
      tags: ["Auth"],
      summary: "Listar usuarios",
      security: bearerSecurity,
      responses: {
        "200": {
          description: "Lista de usuarios",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/UsuarioPublico" },
              },
            },
          },
        },
        "401": {
          description: "Token inválido",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApiError" },
            },
          },
        },
      },
    },
  },
  "/api/auth/usuarios/{id}": {
    get: {
      tags: ["Auth"],
      summary: "Obtener usuario por ID",
      security: bearerSecurity,
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      responses: {
        "200": { description: "Usuario encontrado" },
        "404": { description: "Usuario no encontrado" },
      },
    },
    put: {
      tags: ["Auth"],
      summary: "Actualizar usuario",
      security: bearerSecurity,
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/RegisterRequest" },
          },
        },
      },
      responses: {
        "200": { description: "Usuario actualizado" },
        "404": { description: "Usuario no encontrado" },
      },
    },
    delete: {
      tags: ["Auth"],
      summary: "Eliminar usuario",
      security: bearerSecurity,
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      responses: {
        "200": { description: "Usuario eliminado" },
        "404": { description: "Usuario no encontrado" },
      },
    },
  },
  "/api/productos/": {
    get: {
      tags: ["Productos"],
      summary: "Listar productos",
      responses: {
        "200": {
          description: "Lista de productos",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Producto" },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ["Productos"],
      summary: "Crear producto (admin)",
      security: bearerSecurity,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ProductoInput" },
          },
        },
      },
      responses: {
        "201": {
          description: "Producto creado",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Producto" },
            },
          },
        },
      },
    },
  },
  "/api/productos/{id}": {
    get: {
      tags: ["Productos"],
      summary: "Obtener producto por ID",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      responses: {
        "200": {
          description: "Producto encontrado",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Producto" },
            },
          },
        },
        "404": { description: "Producto no encontrado" },
      },
    },
    put: {
      tags: ["Productos"],
      summary: "Actualizar producto (admin)",
      security: bearerSecurity,
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ProductoInput" },
          },
        },
      },
      responses: { "200": { description: "Producto actualizado" } },
    },
    delete: {
      tags: ["Productos"],
      summary: "Eliminar producto (admin)",
      security: bearerSecurity,
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      responses: { "200": { description: "Producto eliminado" } },
    },
  },
  "/api/productos/categorias": {
    get: {
      tags: ["Productos"],
      summary: "Listar categorías",
      responses: {
        "200": {
          description: "Lista de categorías",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Categoria" },
              },
            },
          },
        },
      },
    },
  },
  "/api/productos/imagenes": {
    get: {
      tags: ["Productos"],
      summary: "Listar imágenes de productos",
      responses: { "200": { description: "Lista de imágenes" } },
    },
  },
  "/api/pedidos/": {
    get: {
      tags: ["Pedidos"],
      summary: "Listar todos los pedidos",
      security: bearerSecurity,
      responses: {
        "200": {
          description: "Lista de pedidos",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  orders: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Pedido" },
                  },
                },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ["Pedidos"],
      summary: "Crear pedido (checkout)",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateOrderRequest" },
          },
        },
      },
      responses: {
        "201": {
          description: "Pedido creado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  order: { $ref: "#/components/schemas/Pedido" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/api/pedidos/usuario/{id_usuario}": {
    get: {
      tags: ["Pedidos"],
      summary: "Pedidos de un usuario",
      security: bearerSecurity,
      parameters: [
        {
          name: "id_usuario",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      responses: { "200": { description: "Pedidos del usuario" } },
    },
  },
  "/api/pedidos/pedido/{id_compra}": {
    get: {
      tags: ["Pedidos"],
      summary: "Detalle de pedido",
      security: bearerSecurity,
      parameters: [
        {
          name: "id_compra",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      responses: { "200": { description: "Detalle del pedido" } },
    },
    put: {
      tags: ["Pedidos"],
      summary: "Actualizar estado del pedido",
      security: bearerSecurity,
      parameters: [
        {
          name: "id_compra",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                estado: {
                  type: "string",
                  enum: ["pending", "shipped", "delivered", "cancelled"],
                },
              },
              required: ["estado"],
            },
          },
        },
      },
      responses: { "200": { description: "Estado actualizado" } },
    },
    delete: {
      tags: ["Pedidos"],
      summary: "Eliminar pedido",
      security: bearerSecurity,
      parameters: [
        {
          name: "id_compra",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      responses: { "200": { description: "Pedido eliminado" } },
    },
  },
};
