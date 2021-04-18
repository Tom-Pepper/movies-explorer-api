/**
 * Описание роутов фильмов
 */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/moviesController');

const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]+\.[a-zA-Z0-9()]+([-a-zA-Z0-9()@:%_\\+.~#?&/=#]*)/;

router.get('/movies', getMovies);

router.post('/movies',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required().min(4).length(4),
      description: Joi.string().required(),
      image: Joi.string().required().pattern(regex),
      trailer: Joi.string().required().pattern(regex),
      thumbnail: Joi.string().required().pattern(regex),
      movieId: Joi.number().positive().required().integer(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie);

router.delete('/movies/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().required().length(24).hex(),
    }),
  }),
  deleteMovie);

module.exports = router;
