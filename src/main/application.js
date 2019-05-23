require('dotenv').config();
const express = require('express')
const config = require('./application.config')
const randomImageController = require('./gateway/http/RandomImageController')

const app = express()
const port = config.express.port

randomImageController.registryEndPoint(app)

app.listen(port, () => console.log(`app listening on port ${port}!`))