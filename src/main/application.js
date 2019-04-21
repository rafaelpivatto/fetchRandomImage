const express = require('express')
const config = require('./application.config')

const app = express()
const port = config.express.port

//Todo: Registry end point

app.listen(port, () => console.log(`app listening on port ${port}!`))