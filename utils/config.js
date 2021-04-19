/**
 * Защита от DDoS- атак
 */
const rateLimit = require('express-rate-limit');

const DB_ADDRESS = 'mongodb://localhost:27017/moviesexplorerdb';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

module.exports = {
  limiter,
  DB_ADDRESS,
};
