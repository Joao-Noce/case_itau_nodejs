const cron = require("node-cron");
const repo = require("../../config/repo");
const RepetirRegistroUseCase = require("../../application/usecases/registro/RepetirRegistro");

const useCase = new RepetirRegistroUseCase(repo.registroRepository);
const hora = process.env.HORACRON;
const minuto = process.env.MINUTOCRON;
console.log(`Cron agendado para ${hora}:${minuto}`);
//? roda todo dia às 11:40
cron.schedule(`${minuto} ${hora} * * *`, async () => {
  console.log("🔄 Rodando job de repetição...");
  await useCase.executar();
});