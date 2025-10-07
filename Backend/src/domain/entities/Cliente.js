class Cliente {
  constructor({ idCliente, nome, email, saldo }) {
    this.idCliente = idCliente;
    this.nome = nome;
    this.email = email;
    this.saldo = saldo ?? 0;
  }
}

module.exports = Cliente;
