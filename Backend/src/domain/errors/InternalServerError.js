const AppError = require("./AppError");

class InternalServerError extends AppError {
  constructor(message = "Erro interno do servidor") {
    super(message, 500);
  }
}

module.exports = InternalServerError;