const { NotFoundError, InternalServerError, ConflictError } = require("../../../domain/errors");

class AtualizarCliente {
  constructor(clienteRepository) {
    this.clienteRepository = clienteRepository;
  }

  async execute(id, { nome, email }) {
    const clienteExistente = await this.clienteRepository.buscarPorIdCliente(id);
    if (!clienteExistente) throw new NotFoundError("Cliente não encontrado");

    clienteExistente.nome = nome ?? clienteExistente.nome;
    clienteExistente.email = email ?? clienteExistente.email;

    const existente = await this.clienteRepository.buscarPorEmail(email, id);
    if (existente) throw new ConflictError("Já existe um cliente com este email");

    const atualizado = await this.clienteRepository.atualizar(id, clienteExistente);
    if (!atualizado) throw new InternalServerError("Falha ao atualizar cliente");

    return clienteExistente;
  }
}

module.exports = AtualizarCliente;
