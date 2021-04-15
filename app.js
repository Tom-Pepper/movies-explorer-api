require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const rateLimit = require('express-rate-limit');

// Защита от DDoS- атак
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

const { PORT = 3000 } = process.env;
// Порт для теста локально
// const PORT = 3001;
const app = express();

app.use(helmet());

// Подключение БД
mongoose.connect('mongodb://localhost:27017/moviesexplorerdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  .then(() => console.log('Movies Explorer is connected to DB'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(limiter);

// Обработка ошибок
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
