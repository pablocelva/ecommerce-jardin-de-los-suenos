require('dotenv').config();
const { Pool } = require('pg');

const DB = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    jwt_secret: process.env.JWT_SECRET,
    port: process.env.DB_PORT,
    allowExitOnIdle: true,
});

module.exports = { DB };