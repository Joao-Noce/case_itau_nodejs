const { BadRequestError, ConflictError } = require("../../../domain/errors");

class CriarCliente {
  constructor(clienteRepository) {
    this.clienteRepository = clienteRepository;
  }

  async execute({ nome, email }) {
    if (!nome || !email) throw new BadRequestError("Nome e email são obrigatórios");

    const existente = await this.clienteRepository.buscarPorEmail(email);
    if (existente) throw new ConflictError("Já existe um cliente com este email");

    const cliente = { nome, email, saldo: 0 };
    return await this.clienteRepository.criar(cliente);
  }
}

module.exports = CriarCliente;
