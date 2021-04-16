require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const rateLimit = require('express-rate-limit');
const { errLogger, apiLogger } = require('./middlewares/logger');

const NotFoundError = require('./errors/notFoundError');

const { createUser, loginUser } = require('./controllers/usersController');
const auth = require('./middlewares/auth');

/**
 * Защита от DDoS- атак
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

const { PORT = 3000 } = process.env;

const app = express();

app.use(helmet());

/**
 * Подключение к MongoDB
 */
mongoose.connect('mongodb://localhost:27017/moviesexplorerdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  .then(() => console.log('Movies Explorer is connected to DB'));

app.use(cors());

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

/**
 * Обработка ошибок
 */
app.use((err, req, res, next) => {
  const { message } = err;
  const statusCode = err.statusCode || 500;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Произошла ошибка на сервере'
      : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log(`Movie Explorer Backend is listening on port ${PORT}`);
});
