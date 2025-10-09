const repo = require("../../config/repo");
const CriarRegistro = require("../../application/usecases/registro/CriarRegistro");
const BuscarRegistrosPorFkClienteData = require("../../application/usecases/registro/BuscarRegistrosPorFkClienteData");
const AtualizarRegistro = require("../../application/usecases/registro/AtualizarRegistro");
const DeletarRegistro = require("../../application/usecases/registro/DeletarRegistro");
const AgruparPorFkCategoria = require("../../application/usecases/registro/AgruparPorFkCategoria");
const BuscarFixosPorFkClienteData = require("../../application/usecases/registro/BuscarFixosPorFkClienteData");
const CalcularSaldoMensalFkCliente = require("../../application/usecases/registro/CalcularSaldoMensalFkCliente");

class RegistrosController {
  async criar(req, res, next) {
    try {
      const registro = await new CriarRegistro(repo.registroRepository).execute(req.body);
      res.status(201).json(registro);
    } catch (err) {
      next(err);
    }
  }

  async buscarRegistrosPorFkClienteData(req, res, next) {
    try {
      const fkCliente = Number(req.query.fkCliente);
      const ano = Number(req.query.ano);
      const mes = Number(req.query.mes);

      const registros = await new BuscarRegistrosPorFkClienteData(repo.registroRepository).execute(fkCliente, ano, mes);
      res.json(registros);
    } catch (err) {
      next(err);
    }
  }

  async buscarFixosPorFkClienteData(req, res, next) {
    try {
      const fkCliente = Number(req.query.fkCliente);
      const ano = Number(req.query.ano);
      const mes = Number(req.query.mes);

      const registrosFixos = await new BuscarFixosPorFkClienteData(repo.registroRepository).execute(fkCliente, ano, mes);
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

  async agruparPorFkCategoria(req, res, next) {
    try {
      const fkCliente = Number(req.query.fkCliente);
      const ano = Number(req.query.ano);
      const mes = Number(req.query.mes);
      const resultado = await new AgruparPorFkCategoria(repo.registroRepository).execute(fkCliente, ano, mes);
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  }

  async calcularSaldoMensalFkCliente(req, res, next) {
    try {
      const fkCliente = Number(req.query.fkCliente);
      const ano = Number(req.query.ano);

      const resultado = await new CalcularSaldoMensalFkCliente(repo.registroRepository).execute(fkCliente, ano);
      res.json(resultado);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new RegistrosController();
