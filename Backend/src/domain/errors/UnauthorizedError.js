const AppError = require("./AppError");

class UnauthorizedError extends AppError {
  constructor(message = "Não autenticado") {
    super(message, 401);
  }
}

module.exports = UnauthorizedError;