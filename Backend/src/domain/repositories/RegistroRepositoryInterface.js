class RegistroRepositoryInterface {
  async criar(registro) {
    throw new Error("Method not implemented: criar");
  }

  async buscarPorId(id) {
    throw new Error("Method not implemented: buscarPorId");
  }

  async atualizar(id, registro) {
    throw new Error("Method not implemented: atualizar");
  }

  async deletar(id) {
    throw new Error("Method not implemented: deletar");
  }

  async buscarPorFkClienteData(fkCliente, inicio, fim) {
    throw new Error("Method not implemented: buscarPorFkCliente");
  }

  async buscarFixosPorClienteData(fkCliente, ano, mes) {
    throw new Error("Method not implemented: buscarFixosPorClienteData")
  }

  async calcularSaldoAtualFkCliente(fkCliente, dataHoje) {
    throw new Error("Method not implemented: calcularSaldoAtualFkCliente");
  }

  async buscarPorData(hoje) {
    throw new Error("Method not implemented: buscarPorData");
  }
  
  async calcularSaldoMensalFkCliente(fkCliente, inicio, fim) {
    throw new Error("Method not implemented: calcularSaldoMensalFkCliente");
  }

  async agruparPorFkCategoria(fkCliente, inicio, fim) {
    throw new Error("Method not implemented: agruparPorCategoria");
  }
}

module.exports = RegistroRepositoryInterface;
