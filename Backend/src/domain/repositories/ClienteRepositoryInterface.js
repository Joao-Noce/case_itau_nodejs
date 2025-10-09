class ClienteRepositoryInterface {
  async listar() { throw new Error("Method not implemented: listar"); }
  async buscarPorIdCliente(id) { throw new Error("Method not implemented: buscarPorIdCliente"); }
  async buscarPorEmail(email) { throw new Error("Method not implemented: buscarPorEmail"); }
  async criar(cliente) { throw new Error("Method not implemented: criar"); }
  async atualizar(cliente) { throw new Error("Method not implemented: atualizar"); }
  async deletar(id) { throw new Error("Method not implemented: deletar"); }
  async autenticar(cliente) { throw new Error("Method not Implemented: autenticar"); }
}

module.exports = ClienteRepositoryInterface;
