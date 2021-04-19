/**
 * Контроллер пользователей. Регистрация, авторизация нового пользователя.
 * Описание методов получения и обновления данных пользователя
 */
const { NODE_ENV, JWT_SECRET_KEY } = process.env;
const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SALT_ROUNDS = 10;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');
const ValidationError = require('../errors/validationError');

/**
 * Возвращает информацию о пользователе (email и имя)
 * GET /users/me
 */
const getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь с таким id не найден!'));
      }
      res.send(user);
    })
    .catch((err) => next(err));
};

/**
 * Обновляет информацию о пользователе (email и имя)
 * PATCH /users/me
 */
const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new ValidationError('Переданы не корректные данные'));
      }
      res.send({ name: user.name, email: user.email });
    })
    .catch((err) => next(err));
};

/**
 * Добавление нового пользователя в БД
 * @param req — запрос
 * @param res — результат
 * @param next — обработчик ошибок
 */
const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  if (!email || !password) {
    next(new ValidationError('Не переданы email или пароль'));
  }
  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.send({ message: `Пользователь ${user.name} успешно зарегистрирован. E-mail: ${user.email}` });
    })
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      }
      next(err);
    });
};

/**
 * Авторизация пользователя в системе
 * @param req — запрос
 * @param res — результат
 * @param next — обработчик ошибок
 */
const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new ValidationError('Пароль и email обязательны!'));
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET_KEY : 'dev-secret',
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getProfile,
  updateProfile,
  createUser,
  loginUser,
};
