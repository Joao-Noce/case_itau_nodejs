const repo = require("../../config/repo");
const CriarRegistro = require("../../application/usecases/registro/CriarRegistro");
const BuscarRegistrosPorClienteData = require("../../application/usecases/registro/BuscarRegistrosPorClienteData");
const AtualizarRegistro = require("../../application/usecases/registro/AtualizarRegistro");
const DeletarRegistro = require("../../application/usecases/registro/DeletarRegistro");
const AgruparPorCategoria = require("../../application/usecases/registro/AgruparPorCategoria");
const BuscarFixosPorClienteData = require("../../application/usecases/registro/BuscarFixosPorClienteData");
const CalcularSaldoMensal = require("../../application/usecases/registro/CalcularSaldoMensal");

class RegistrosController {
  async criar(req, res, next) {
    try {
      const registro = await new CriarRegistro(repo.registroRepository).execute(req.body);
      res.status(201).json(registro);
    } catch (err) {
      next(err);
    }
  }

  async buscarRegistrosPorClienteData(req, res, next) {
    try {
      const fkCliente = Number(req.query.fkCliente);
      const ano = Number(req.query.ano);
      const mes = Number(req.query.mes);

      const registros = await new BuscarRegistrosPorClienteData(repo.registroRepository).execute(fkCliente, ano, mes);
      res.json(registros);
    } catch (err) {
      next(err);
    }
  }

  async buscarFixosPorClienteData(req, res, next) {
    try {
      const fkCliente = Number(req.query.fkCliente);
      const ano = Number(req.query.ano);
      const mes = Number(req.query.mes);

      const registrosFixos = await new BuscarFixosPorClienteData(repo.registroRepository).execute(fkCliente, ano, mes);
      res.json(registrosFixos);
    } catch (err) {
      next(err);
    }
  }

  async atualizar(req, res, next) {
    try {
      const atualizado = await new AtualizarRegistro(repo.registroRepository).execute(req.params.id, req.body);
      res.json(atualizado);
    } catch (err) {
      next(err);
    }
  }

  async deletar(req, res, next) {
    try {
      await new DeletarRegistro(repo.registroRepository).execute(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async agruparPorCategoria(req, res, next) {
    try {
      const fkCliente = Number(req.query.fkCliente);
      const ano = Number(req.query.ano);
      const mes = Number(req.query.mes);
      const resultado = await new AgruparPorCategoria(repo.registroRepository).execute(fkCliente, ano, mes);
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  }

  async calcularSaldoMensal(req, res, next) {
    try {
      const fkCliente = Number(req.query.fkCliente);
      const ano = Number(req.query.ano);

      const resultado = await new CalcularSaldoMensal(repo.registroRepository).execute(fkCliente, ano);
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RegistrosController();
