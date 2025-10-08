const repo = require("../../../config/repo");
const CalcularSaldoAtualCliente = require("../cliente/CalcularSaldoAtualCliente");
const Big = require("big.js");

class BuscarFixosPorClienteData {
  constructor(registroRepository) {
    this.registroRepository = registroRepository;
  }

  async execute(fkCliente, ano, mes) {
    if (!fkCliente) throw new Error("fkCliente é obrigatório");

    const rows = await this.registroRepository.buscarFixosPorClienteData(fkCliente, ano, mes);

    let entradaTotal = new Big(0);
    let saidaTotal = new Big(0);

    for (const row of rows) {
      const valor = new Big(row.valor);
      if (row.tipo === "Deposito") entradaTotal = entradaTotal.plus(valor);
      else if (row.tipo === "Saque") saidaTotal = saidaTotal.plus(valor);
    }
    const saldoFinal = entradaTotal.minus(saidaTotal);

    const saldoAtual = await new CalcularSaldoAtualCliente(repo.clienteRepository).execute(fkCliente);

    return {
      saldoAtual,
      entradaTotal: entradaTotal.toNumber(),
      saidaTotal: saidaTotal.toNumber(),
      saldoFinal: saldoFinal.toNumber(),
      rows
    }
  }
}

module.exports = BuscarFixosPorClienteData;
