const express = require('express')
const logger = require('morgan')
const cors = require('cors')
require("dotenv").config()

const authRouter = require("./routes/api/auth-routes")
const moviesRouter = require("./routes/api/movies-routes")

class App {
  constructor() {
    this.app = express();
    this.formatsLogger = this.app.get('env') === 'development' ? 'dev' : 'short';
    this.app.use(logger(this.formatsLogger));
    this.app.use(cors());
    this.app.use(express.json());

    this.app.use('/api/auth', authRouter);
    this.app.use('/api/movies', moviesRouter);
    
    this.app.use((req, res) => {
      res.status(404).json({ message: 'Not found' });
    });

    this.app.use((err, req, res, next) => {
      const { status = 500, message = 'Server error' } = err;
      res.status(status).json({ message });
    });
  }



}

module.exports = new App().app;

// const app = express()

// const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

// app.use(logger(formatsLogger))
// app.use(cors())
// app.use(express.json())

// app.use("/api/auth", authRouter)
// app.use("/api/movies", moviesRouter)

// app.use((req, res) => {
//   res.status(404).json({ message: 'Not found' })
// })

// app.use((err, req, res, next) => {
//   const {status = 500, message = "Server error"} = err;
//   res.status(status).json({ message, })
// })

// module.exports = app
