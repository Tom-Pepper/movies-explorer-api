/**
 * Централизованная обработка ошибок.
 * Ошибка доступа
 */
class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
