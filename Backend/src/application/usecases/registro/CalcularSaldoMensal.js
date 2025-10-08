class CalcularSaldoMensal {
    constructor(registroRepository) {
        this.registroRepository = registroRepository;
    }

    async execute(fkCliente, ano) {
        if (!fkCliente) throw new Error("fkCliente é obrigatório");
        if (!ano) throw new Error("ano é obrigatório");

        

        const rows = await this.registroRepository.calcularSaldoMensal(fkCliente, ano);

        return rows;
    }
}

module.exports = CalcularSaldoMensal;
