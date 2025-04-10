module.exports = {
    TRIP_NOT_FOUND: {
        id: 'viajeNoEncontrado',
        statusCode: 404,
        message: "Viaje no encontrado",
        description: "El viaje con ese id no existe en la base de datos"
    },
    SERVER_ERROR: {
        id: 'errorDelServidor',
        statusCode: 500,
        message: "Error del servidor",
        description: "Ha ocurrido un error al intentar realizar la operación solicitada"
    },
    USER_NOT_FOUND: {
        id: "userNotFound",
        statusCode: 404, // Corregido de "statuCode" a "statusCode"
        message: 'No se encontró ningún usuario con estos credenciales',
        description: 'No se encontró ningún usuario con estos credenciales',
    },
}
