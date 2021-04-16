/**
 * Подключение роутов — чтобы в app.js импортировался единый роут
 */
const router = require('express').Router();
const userRoutes = require('./users.js');
const moviesRoutes = require('./movies.js');

router.use('/users', userRoutes);
router.use('/movies', moviesRoutes);

module.exports = router;
