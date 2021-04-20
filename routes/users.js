/**
 * Описание роутов пользователя
 */
const router = require('express').Router();
const { getProfile, updateProfile } = require('../controllers/usersController');
const { patchUserValidate } = require('../middlewares/validate');

router.get('/users/me', getProfile);

router.patch('/users/me', patchUserValidate, updateProfile);

module.exports = router;
