const { BadRequestError, NotFoundError } = require("../../../domain/errors");
const repo = require("../../../config/repo");
const CalcularSaldoAtualFkCliente = require("../registro/CalcularSaldoAtualFkCliente");

class AutenticarCliente {
  constructor(clienteRepository, registroRepository) {
    this.clienteRepository = clienteRepository;
    this.registroRepository = registroRepository;
  }

  async execute({ nome, email }) {
    if (!nome || !email) throw new BadRequestError("Nome e email são obrigatórios");

    const cliente = { nome, email };
    const clienteAutenticado = await this.clienteRepository.autenticar(cliente);
    if (!clienteAutenticado) throw new NotFoundError("Cliente não encontrado");

    const saldoAtual = await new CalcularSaldoAtualFkCliente(repo.registroRepository).execute(clienteAutenticado.idCliente);
    
    clienteAutenticado.saldo = saldoAtual;

    return clienteAutenticado;
  }
}

module.exports = AutenticarCliente;
