export class AppError extends Error {
  readonly id: string;
  readonly statusCode: number;
  readonly description: string;

  constructor(
    id: string,
    message: string,
    statusCode: number,
    description: string,
  ) {
    super(message);
    this.name = "AppError";
    this.id = id;
    this.statusCode = statusCode;
    this.description = description;
  }
}

export const ERROR_CATALOG = {
  TRIP_NOT_FOUND: {
    id: "viajeNoEncontrado",
    statusCode: 404,
    message: "Viaje no encontrado",
    description: "El viaje con ese id no existe en la base de datos",
  },
  SERVER_ERROR: {
    id: "errorDelServidor",
    statusCode: 500,
    message: "Error del servidor",
    description:
      "Ha ocurrido un error al intentar realizar la operación solicitada",
  },
  USER_NOT_FOUND: {
    id: "userNotFound",
    statusCode: 404,
    message: "No se encontró ningún usuario con estos credenciales",
    description: "No se encontró ningún usuario con estos credenciales",
  },
  EMAIL_NOT_REGISTERED: {
    id: "emailNoRegistrado",
    statusCode: 400,
    message: "El correo no está registrado",
    description: "El correo no está registrado",
  },
  INVALID_CREDENTIALS: {
    id: "credencialesInvalidas",
    statusCode: 400,
    message: "Credenciales incorrectas",
    description: "Credenciales incorrectas",
  },
  EMAIL_ALREADY_EXISTS: {
    id: "correoDuplicado",
    statusCode: 409,
    message: "El correo ya está registrado",
    description: "El correo ya está registrado",
  },
  NOT_FOUND: {
    id: "recursoNoEncontrado",
    statusCode: 404,
    message: "Recurso no encontrado",
    description: "El recurso solicitado no existe",
  },
  VALIDATION_ERROR: {
    id: "errorValidacion",
    statusCode: 400,
    message: "Error de validación",
    description: "Los datos enviados no son válidos",
  },
  INVALID_TOKEN: {
    id: "tokenInvalido",
    statusCode: 401,
    message: "Token inválido",
    description: "Token inválido o expirado",
  },
  ORDER_NOT_FOUND: {
    id: "pedidoNoEncontrado",
    statusCode: 404,
    message: "Pedido no encontrado",
    description: "El pedido solicitado no existe",
  },
} as const;

export function createAppError(
  key: keyof typeof ERROR_CATALOG,
): AppError {
  const error = ERROR_CATALOG[key];
  return new AppError(
    error.id,
    error.message,
    error.statusCode,
    error.description,
  );
}
