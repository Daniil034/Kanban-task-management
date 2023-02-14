const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
require('dotenv').config();

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

const boardsRouter = require('./routes/boards');
// const { response } = require("express");
app.use('/boards', boardsRouter);

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  console.error(status, err.message);
  res.status(status).send({error: err.message});
})

app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
  });
  