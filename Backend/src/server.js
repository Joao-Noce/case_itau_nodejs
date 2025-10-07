const app = require("./app");
require("./infrastructure/jobs/RegistroRepeticao.job");

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`🚀 Server rodando na porta ${PORT}`);
})