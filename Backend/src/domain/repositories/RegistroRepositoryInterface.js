class RegistroRepositoryInterface {
  async criar(registro) {
    throw new Error("Method not implemented: criar");
  }

  async buscarPorId(id) {
    throw new Error("Method not implemented: buscarPorId");
  }

  // async listar() {
  //   throw new Error("Method not implemented: listar");
  // }

  async atualizar(id, registro) {
    throw new Error("Method not implemented: atualizar");
  }

  async deletar(id) {
    throw new Error("Method not implemented: deletar");
  }

  async buscarPorFkCliente(fkCliente) {
    throw new Error("Method not implemented: buscarPorFkCliente");
  }

  async buscarFixosPorClienteData(fkCliente, ano, mes) {
    throw new Error("Method not implemented: buscarFixosPorClienteData")
  }

  async calcularSaldoAtual(fkCliente) {
    throw new Error("Method not implemented: calcularSaldoAtual");
  }

  async buscarPorData(hoje) {
    throw new Error("Method not implemented: buscarPorData");
  }
  
  async calcularSaldoMensal(fkCliente, ano) {
    throw new Error("Method not implemented: calcularSaldoMensal");
  }

  async agruparPorCategoria(fkCliente, ano, mes) {
    throw new Error("Method not implemented: agruparPorCategoria");
  }
}

module.exports = RegistroRepositoryInterface;
