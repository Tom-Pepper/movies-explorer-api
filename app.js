require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const DB_ADDRESS = require('./utils/config');
const limiter = require('./utils/rateLimiter');
const { errLogger, apiLogger } = require('./middlewares/logger');
const errorHandler = require('./errors/errorHandler');

const { PORT = 3000, DB_LOCAL = DB_ADDRESS } = process.env;

const app = express();

app.use(helmet());
app.use(cors());

/**
 * Подключение к MongoDB
 */
mongoose.connect(DB_LOCAL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  .then(() => console.log('Movies Explorer is connected to DB'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(apiLogger);
app.use(limiter);

app.use('/', require('./routes/index'));

app.use(errLogger);
app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Movie Explorer Backend is listening on port ${PORT}`);
});
