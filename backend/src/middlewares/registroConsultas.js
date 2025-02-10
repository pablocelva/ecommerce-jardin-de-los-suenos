const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');
const logFilePath = path.join(logDir, 'consultas.log');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const registerQuery = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const token = req.headers['authorization'] || 'Sin credenciales';
    const body = Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : 'Sin parámetros';
/*
    let log = "";

    if (!token) {
        log += `Ruta consultada: ${req.originalUrl} ; Método: ${req.method} ; Fecha: ${new Date().toISOString()} ; Ruta sin credenciales\n`;
    } else {
        log += `Ruta consultada: ${req.originalUrl} ; Método: ${req.method} ; Fecha: ${new Date().toISOString()} ; Ruta con credenciales: ${token}\n`;
    }

    if (Object.keys(body).length > 0) {
        log += `Ruta consultada: ${req.originalUrl} ; Método: ${req.method} ; Fecha: ${new Date().toISOString()} ; Parametros Body :  ${JSON.stringify(body)} \n`;
    }*/
    const log = `[${timestamp}] Ruta: ${req.originalUrl} | Método: ${req.method} | Token: ${token} | Body: ${body}\n`;

    console.log(log)

    /*fs.appendFile(logFilePath, log, (err) => {
        if (err) {
            console.error('Error al registrar la consulta:', err);
        }
    });*/

    try {
        fs.appendFileSync(logFilePath, log);
    } catch (err) {
        console.error('❌ Error al escribir en el log:', err);
    }

    next();
};

const registerResponse = (req, res, next) => {
/*
    const logDir = path.join(__dirname, '..', 'logs');
    const logFilePath = path.join(logDir, 'consultas.log');

    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }*/
    const timestamp = new Date().toISOString();

    const originalSend = res.send;

    res.send = function (body) {

        const responseBody = typeof body === 'object' ? JSON.stringify(body, null, 2) : body;

        /*const log = `Ruta: ${req.originalUrl} ; Método: ${req.method} ; Fecha: ${new Date().toISOString()} ; Respuesta: ${responseBody}\n`;*/
        const log = `[${timestamp}] Ruta: ${req.originalUrl} | Método: ${req.method} | Respuesta: ${responseBody}\n`;

        console.log(log)

        /*fs.appendFile(logFilePath, log, (err) => {
            if (err) {
                console.error('Error al registrar la respuesta:', err);
            }
        });*/
        try {
            fs.appendFileSync(logFilePath, log);
        } catch (err) {
            console.error('❌ Error al escribir en el log:', err);
        }

        return originalSend.apply(this, arguments);
    };

    next();
};

module.exports = { registerQuery, registerResponse }