const express = require("express");
const RegistrosController = require("../controllers/RegistrosController");
const validateRequest = require("../middlewares/ValidateRequest");
const router = express.Router();

router.get("/", RegistrosController.buscarRegistrosPorFkClienteData);
router.get("/fixos", RegistrosController.buscarFixosPorFkClienteData);
router.get("/categorias", RegistrosController.agruparPorFkCategoria);
router.get("/mensal", RegistrosController.calcularSaldoMensalFkCliente);
router.post("/", validateRequest(["descricao", "valor", "data", "tipo", "repeticao", "fkCliente"]), RegistrosController.criar);
router.put("/:id", validateRequest(["descricao", "valor", "data", "tipo", "fkCliente"]), RegistrosController.atualizar);
router.delete("/:id", RegistrosController.deletar);

module.exports = router;
