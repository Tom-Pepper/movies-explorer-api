/**
 * Централизованная обработка ошибок.
 * Ошибка уже существующих данных
 */
class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
