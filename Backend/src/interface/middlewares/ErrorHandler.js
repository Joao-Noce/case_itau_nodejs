module.exports = (err, req, res, next) => {
  console.error("🔥 Erro capturado:", err);

  const status = err.statusCode || err.status || 500;

  res.status(status).json({
    error: err.message || "Erro interno do servidor",
  });
};
