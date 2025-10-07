const { NotFoundError, InternalServerError } = require("../../../domain/errors");

class DeletarCliente {
  constructor(clienteRepository) {
    this.clienteRepository = clienteRepository;
  }

  async execute(id) {
    const clienteExistente = await this.clienteRepository.buscarPorIdCliente(id);
    if (!clienteExistente) throw new NotFoundError("Cliente não encontrado");

    const deletado = await this.clienteRepository.deletar(id);
    if (!deletado) throw new InternalServerError("Falha ao deletar cliente");
    
    return true;
  }
}

module.exports = DeletarCliente;
