require('dotenv').config();
const app = require('./src/app');
const { DB } = require('./src/config/db');

const { PORT } = process.env

// Prueba de conexión a la base de datos
DB.connect()
    .then(() => console.log('Conectado a PostgreSQL'))
    .catch(err => console.error('Error de conexión a PostgreSQL:', err));

//Inicio del servidor
app.listen(PORT || 3000, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});