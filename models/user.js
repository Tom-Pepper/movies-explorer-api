/**
 * Схема добавления пользователя в БД
 * Описание полей пользователя и их валидация
 */
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const { default: validator } = require('validator');
const AuthError = require('../errors/authError');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    email: {
      required: true,
      type: String,
      validate: {
        validator(v) {
          return validator.isEmail(v);
        },
      },
      unique: true,
    },
    password: {
      required: true,
      type: String,
      select: false,
    },
  },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthError('Не корректный пароль или email'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthError('Не корректный пароль или email'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
