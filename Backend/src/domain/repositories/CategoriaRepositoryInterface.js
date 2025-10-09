class CategoriaRepositoryInterface {
  async criar(categoria, fkCliente) {
    throw new Error("Method not implemented: create");
  }

  async buscarPorFkCliente(fkCliente) {
    throw new Error("Method not implemented: listarTodosPorFkCliente");
  }

  async buscarPorIdCategoria(idCategoria) {
    throw new Error("Method not implemented: buscarPorIdCategoria");
  }

  async atualizar(idCategoria, { nome, fkCliente} ) {
    throw new Error("Method not implemented: atualizar");
  }

  async deletar(idCategoria, fkCliente) {
    throw new Error("Method not implemented: deletar");
  }
}

module.exports = CategoriaRepositoryInterface;
