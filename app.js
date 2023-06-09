const express = require('express')
const logger = require('morgan')
const cors = require('cors')
require("dotenv").config()

const authRouter = require("./routes/api/auth-routes")
const moviesRoutes = require("./routes/api/movies-routes")


const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())


app.use("/api/auth", authRouter.getRouter())
app.use("/api/movies", moviesRoutes.getRouter())

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  const {status = 500, message = "Server error"} = err;
  res.status(status).json({ message, })
})

module.exports = app
