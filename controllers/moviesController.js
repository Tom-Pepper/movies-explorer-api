/**
 * Контроллер фильмов.
 */
const Movie = require('../models/movie');

const ForbiddenError = require('../errors/forbiddenError');
const NotFoundError = require('../errors/notFoundError');
const ValidationError = require('../errors/validationError');

/**
 * Возвращает все сохранённые пользователем фильмы
 * GET /movies
 */
const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ movies }))
    .catch((err) => next(err));
};

/**
 * создаёт фильм с переданными в теле
 * country, director, duration, year, description, image,
 * trailer, nameRU, nameEN и thumbnail, movieId
 * POST /movies
 */
const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    owner,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  })
    .then((movie) => res.send({ body: movie }))
    .catch((err) => next(err));
};

/**
 * Удаляет сохранённый фильм по _id
 * DELETE /movies/movieId
 */
const deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie
    .findById({ _id: req.params.movieId }).select('+owner')
    .orFail(() => new NotFoundError('Фильм не найден'))
    .then((movie) => {
      if (!movie.owner.equals(owner)) {
        next(new ForbiddenError('Нет прав на удаление этого фильма'));
      } else {
        Movie.deleteOne(movie)
          .then(() => res.send({ message: `Фильм "${movie.nameRU}(${movie.nameEN}),${movie.year}" удалён` }));
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new ValidationError('Невалидный id фильма'));
      } else {
        next(err);
      }
    });
};
module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
