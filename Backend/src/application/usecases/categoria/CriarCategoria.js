const { BadRequestError, ConflictError } = require("../../../domain/errors");

class CriarCategoria {
  constructor(categoriaRepository) {
    this.categoriaRepository = categoriaRepository;
  }

  async execute({ nome, fkCliente }) {
    if (!nome) throw new BadRequestError("Nome da categoria é obrigatório");

    const categorias = await this.categoriaRepository.buscarPorFkCliente(fkCliente);
    if (categorias.find(c => c.nome === nome) && categorias.find(c => c.fkCliente == fkCliente)) {
      throw new ConflictError("Categoria já existe");
    }

    return this.categoriaRepository.criar({ nome, fkCliente });
  }
}

module.exports = CriarCategoria;
