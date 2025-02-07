require('dotenv').config();
const app = require('./src/app');

const { PORT } = process.env

//Inicio del servidor
app.listen(PORT || 3000, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});