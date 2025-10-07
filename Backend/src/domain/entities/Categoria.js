class Categoria {
  constructor({ idCategoria, nome, fkCliente }) {
    this.idCategoria = idCategoria;
    this.nome = nome;
    this.fkCliente = fkCliente
  }
}

module.exports = Categoria;
