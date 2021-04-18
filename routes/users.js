/**
 * Описание роутов пользователя
 */
const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getProfile, updateProfile } = require('../controllers/usersController');

router.get('/users/me', getProfile);

router.patch('/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  updateProfile);

module.exports = router;
