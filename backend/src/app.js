const express = require('express')
const morgan = require('morgan')
const APIRoutes = require('./routes/routes')
const cors = require('cors')
const errorMiddleware = require('./middlewares/errorMiddleware')
const registroConsultas = require('./middlewares/registroConsultas')

const app = express()

//middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
app.use(registroConsultas.registerQuery)
app.use(registroConsultas.registerResponse)

//Routes
app.use('/api', APIRoutes)

app.use(errorMiddleware)

module.exports = app;
