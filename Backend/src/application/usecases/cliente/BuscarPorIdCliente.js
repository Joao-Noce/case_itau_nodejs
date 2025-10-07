const { NotFoundError } = require("../../../domain/errors");

class BuscarPorIdCliente {
  constructor(clienteRepository) {
    this.clienteRepository = clienteRepository;
  }

  async execute(id) {
    const cliente = await this.clienteRepository.buscarPorIdCliente(id);
    if (!cliente) throw new NotFoundError("Cliente não encontrado");
    return cliente;
  }
}

module.exports = BuscarPorIdCliente;
