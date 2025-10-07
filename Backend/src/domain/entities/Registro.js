class Registro {
  constructor({ idRegistro, descricao, valor, data, tipo, repeticao, nomeCategoria, fkCliente, fkCategoria }) {
    this.idRegistro = idRegistro;
    this.descricao = descricao;
    this.valor = valor;
    this.data = data;
    this.tipo = tipo;
    this.repeticao = repeticao || 'NONE';
    this.fkCliente = fkCliente;
    this.fkCategoria = fkCategoria;
    this.nomeCategoria = nomeCategoria;
  }
}

module.exports = Registro;
