const repo = require("../../../config/repo");
const CalcularSaldoAtualCliente = require("../cliente/CalcularSaldoAtualCliente");

class BuscarFixosPorClienteData {
  constructor(registroRepository) {
    this.registroRepository = registroRepository;
  }

  async execute(fkCliente, ano, mes) {
    if (!fkCliente) throw new Error("fkCliente é obrigatório");

    const rows = await this.registroRepository.buscarFixosPorClienteData(fkCliente, ano, mes);

    let entradaTotal = 0;
    let saidaTotal = 0;

    for (const row of rows) {
      if (row.tipo === "Deposito") entradaTotal += Number(row.valor);
      else if (row.tipo === "Saque") saidaTotal += Number(row.valor);
    }
    const saldoFinal = entradaTotal - saidaTotal;

    const saldoAtual = await new CalcularSaldoAtualCliente(repo.clienteRepository).execute(fkCliente);

    return {
      saldoAtual,
      entradaTotal,
      saidaTotal,
      saldoFinal,
      rows
    }
  }
}

module.exports = BuscarFixosPorClienteData;
