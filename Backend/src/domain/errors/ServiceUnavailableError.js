const AppError = require("./AppError");

class ServiceUnavailableError extends AppError {
  constructor(message = "Serviço indisponível") {
    super(message, 503);
  }
}

module.exports = ServiceUnavailableError;