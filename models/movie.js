/**
 * Схема добавления фильма в БД
 * Описание полей пользователя и их валидация
 */
const mongoose = require('mongoose');

const linkRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]+\.[a-zA-Z0-9()]+([-a-zA-Z0-9()@:%_\\+.~#?&/=#]*)/;

const movieSchema = new mongoose.Schema(
  {
    country: {
      required: true,
      type: String,
    },
    director: {
      required: true,
      type: String,
    },
    duration: {
      required: true,
      type: Number,
    },
    year: {
      required: true,
      type: String,
    },
    description: {
      required: true,
      type: String,
    },
    image: {
      required: true,
      type: String,
      validate: {
        validator(link) {
          return linkRegex.test(link);
        },
        message: 'Введите корректный URL изображения',
      },
    },
    trailer: {
      required: true,
      type: String,
      validate: {
        validator(link) {
          return linkRegex.test(link);
        },
        message: 'Введите корректный URL трейлера',
      },
    },
    thumbnail: {
      required: true,
      type: String,
      validate: {
        validator(link) {
          return linkRegex.test(link);
        },
        message: 'Введите корректный URL изображения',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
      select: false,
    },
    movieId: {
      required: true,
      type: Number,
    },
    nameRU: {
      require: true,
      type: String,
      minlength: 1,
      maxlength: 100,
    },
    nameEN: {
      require: true,
      type: String,
      minlength: 1,
      maxlength: 100,
    },
  },
);

module.exports = mongoose.model('movie', movieSchema);
