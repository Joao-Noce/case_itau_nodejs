const express = require("express");
const RegistrosController = require("../controllers/RegistrosController");
const validateRequest = require("../middlewares/ValidateRequest");
const router = express.Router();

router.get("/", RegistrosController.buscarRegistrosPorClienteData);

router.get("/fixos", RegistrosController.buscarFixosPorClienteData);

router.get("/categorias", RegistrosController.agruparPorCategoria);

router.get("/mensal", RegistrosController.calcularSaldoMensal);

router.post("/", validateRequest(["descricao", "valor", "data", "tipo", "repeticao", "fkCliente"]), RegistrosController.criar);

router.put("/:id", validateRequest(["descricao", "valor", "data", "tipo", "fkCliente"]), RegistrosController.atualizar);

router.delete("/:id", RegistrosController.deletar);

module.exports = router;
