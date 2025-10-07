const { NotFoundError } = require("../../../domain/errors");

class DeletarCategoria {
  constructor(categoriaRepository) {
    this.categoriaRepository = categoriaRepository;
  }

  async execute(idCategoria, fkCliente) {
    const categoria = await this.categoriaRepository.buscarPorIdCategoria(idCategoria);
    if (!categoria) throw new NotFoundError();

    const deletado = await this.categoriaRepository.deletar(idCategoria, fkCliente.fkCliente);
    if (!deletado) throw new Error("Falha ao deletar categoria");
    return true;
  }
}

module.exports = DeletarCategoria;
