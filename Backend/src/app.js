require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const categoriasRoutes = require("./interface/routes/CategoriasRoutes");
const clientesRoutes = require("./interface/routes/ClientesRoutes");
const registrosRoutes = require("./interface/routes/RegistrosRoutes");
const errorHandler = require("./interface/middlewares/ErrorHandler");

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());

//? Rate Limit: 100 requisições por 15 minutos
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }));

app.use("/categorias", categoriasRoutes);
app.use("/clientes", clientesRoutes);
app.use("/registros", registrosRoutes);

app.use(errorHandler);

module.exports = app;