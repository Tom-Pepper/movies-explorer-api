require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const limiter = require('./utils/config');
const { errLogger, apiLogger } = require('./middlewares/logger');
const errorHandler = require('./errors/errorHandler');

const NotFoundError = require('./errors/notFoundError');

const { createUser, loginUser } = require('./controllers/usersController');
const auth = require('./middlewares/auth');

const { PORT = 3000, DB_ADDRESS } = process.env;

const app = express();

app.use(helmet());
app.use(cors());

/**
 * Подключение к MongoDB
 */
mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  .then(() => console.log('Movies Explorer is connected to DB'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(apiLogger);
app.use(limiter);

/**
 * Подключение роутов и обработка несуществующих роутов
 */
app.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  loginUser);

app.post('/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser);

app.use('/', auth, require('./routes/users'));
app.use('/', auth, require('./routes/movies'));

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errLogger);
app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Movie Explorer Backend is listening on port ${PORT}`);
});
