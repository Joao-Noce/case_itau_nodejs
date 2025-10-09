# 🚀 Projeto Case - Node.js + Angular

Este repositório contém dois projetos principais:

- `Backend/` - API REST em Node.js/Express (SQLite/MySQL para persistência).
- `finance-dashboard/` - Frontend em Angular para consumir a API.

Este README descreve as rotas disponíveis no backend, a arquitetura de pastas adotada, como foram aplicados princípios de Clean Code no projeto e a estrutura do `finance-dashboard`.

## 📚 Sumário

- [🧭 Rotas do Backend](#rotas-do-backend)
- [🏗️ Arquitetura de pastas (Backend)](#arquitetura-de-pastas-backend)
- [✨ Como aplicamos Clean Code](#como-aplicamos-clean-code)
- [💻 Arquitetura de pastas (finance-dashboard)](#arquitetura-de-pastas-finance-dashboard)
- [▶️ Como rodar](#como-rodar)

## 🧭 Rotas do Backend

As rotas estão definidas em `Backend/src/interface/routes`. Abaixo estão os endpoints principais agrupados por recurso.

> Observação: autenticação completa (JWT, roles) não está descrita aqui — os endpoints documentados refletem os arquivos de rota atuais.

### 👥 Clientes

- GET /clientes
  - Lista todos os clientes.
- GET /clientes/:id
  - Busca cliente por ID.
- POST /clientes
  - Cria um cliente. Campos obrigatórios: `nome`, `email`.
- POST /clientes/autenticar
  - Autentica um cliente (mock). Campos obrigatórios: `nome`, `email`.
- PUT /clientes/:id
  - Atualiza um cliente. Campos obrigatórios: `nome`, `email`.
- DELETE /clientes/:id
  - Remove um cliente.

### 📂 Categorias

- GET /categorias
  - Retorna categorias filtradas por cliente (FK enviada via query conforme implementação interna).
- POST /categorias
  - Cria categoria. Campo obrigatório: `nome`.
- PUT /categorias/:idCategoria
  - Atualiza categoria. Campos obrigatórios: `nome`, `fkCliente`.
- DELETE /categorias/:idCategoria
  - Deleta categoria. Campo obrigatório: `fkCliente`.

### 📈 Registros (lançamentos)

- GET /registros
  - Busca registros por cliente e data (parâmetros aplicados via query conforme implementação).
- GET /registros/fixos
  - Retorna registros fixos para um cliente em uma data específica (parâmetros aplicados via query conforme implementação).
- GET /registros/categorias (parâmetros aplicados via query conforme implementação).
  - Agrupa registros por categoria (resumo para dashboard).
- GET /registros/mensal
  - Calcula saldo mensal (depositos - saques) para o cliente dentro de um intervalo de tempo.
- POST /registros
  - Cria um registro. Campos obrigatórios: `descricao`, `valor`, `data`, `tipo`, `repeticao`, `fkCliente`.
- PUT /registros/:id
  - Atualiza um registro. Campos obrigatórios: `descricao`, `valor`, `data`, `tipo`, `fkCliente`.
- DELETE /registros/:id
  - Deleta um registro.

## 🏗️ Arquitetura de pastas (Backend)

Estrutura principal encontrada em `Backend/`:

- `src/`
  - `app.js` - ponto de configuração do Express (middlewares, segurança, rate-limit, CORS).
  - `server.js` - inicia o servidor.
  - `application/` - casos de uso (use cases) organizados por domínio (categoria, cliente, registro). Toda lógica de negócio está aqui.
    - `usecases/<recurso>/` - arquivos que implementam casos de uso (Criar, Atualizar, Listar, Deletar, etc.).
  - `config/` - arquivos de configuração e adaptadores de banco (`sqlite.js`, `mysql.js`, `repo.js`, além do `database.sqlite`).
  - `domain/`
    - `entities/` - classes/objetos de domínio: `Categoria.js`, `Cliente.js`, `Registro.js`.
    - `errors/` - hierarquia de erros customizados (ex.: `NotFoundError`, `BadRequestError`, `AppError`, etc.).
    - `repositories/` - interfaces que definem contratos de repositórios (ex.: `ClienteRepositoryInterface.js`).
  - `infrastructure/`
    - `mysql/` e `sqlite/` - implementações concretas de repositórios para diferentes bancos.
    - `jobs/` - tarefas agendadas (ex.: `RegistroRepeticao.job.js`).
  - `interface/`
    - `controllers/` - camadas de entrada que orquestram casos de uso e montam as respostas HTTP.
    - `middlewares/` - middlewares Express (ex.: `ErrorHandler.js`, `ValidateRequest.js`).
    - `routes/` - definição das rotas expostas.

Observações sobre a arquitetura adotada:

- Segregação clara entre camadas: `interface` (entrada), `application` (casos de uso), `domain` (modelos e contratos) e `infrastructure` (implementações). Isso facilita testes, manutenção e troca de implementações (por exemplo, trocar SQLite por MySQL).
- Repositórios usam interfaces em `domain/repositories` para permitir injeção de dependência e facilitar testes unitários com stubs/mocks.

## ✨ Como é aplicado o Clean Code

Princípios e práticas implementadas no projeto:

- Nomes expressivos: arquivos, funções e variáveis têm nomes que refletem sua responsabilidade (ex.: `CriarCategoria.js`, `ClienteRepositoryInterface.js`).
- Funções pequenas e com única responsabilidade: cada use case implementa uma ação atômica (criar, atualizar, listar, deletar).
- Separação de preocupações (SoC): controllers apenas adaptam a requisição para os casos de uso e formatam respostas; a lógica de negócio fica em `application`.
- Tratamento centralizado de erros: existe `ErrorHandler.js` que transforma exceções de domínio em respostas HTTP adequadas com códigos de status corretos.
- Validação de entrada: middleware `ValidateRequest.js` checa campos obrigatórios antes de invocar os controllers/usecases.
- Interfaces e injeção de dependência: contratos de repositório no `domain` permitem trocar implementações (SQLite/MySQL) sem mudar a lógica de negócio.
- Testabilidade: organização em camadas e uso de interfaces facilita criar testes unitários para `application` e `domain` isoladamente (stubs/mocks para repositórios).

Pequenas recomendações adicionais para evolução:

- Adicionar testes automatizados (Jest/Mocha) cobrindo casos de uso e controllers.
- Implementar autenticação robusta (JWT) e autorização baseada em roles/escopos.

## 💻 Arquitetura de pastas (finance-dashboard)

Estrutura principal encontrada em `finance-dashboard/` (projeto Angular):

- `src/`
  - `main.ts` - bootstrap da aplicação Angular.
  - `index.html`, `styles.scss` - entrada e estilos globais.
  - `app/` - código da aplicação.
    - `app.routes.ts` - definição de rotas do frontend.
    - `app.config.ts` - configurações globais do app (constantes, endpoints da API).
    - `core/` - serviços centrais (ex.: comunicação com a API, autenticação, utilitários).
      - `services/` - serviços que fazem chamadas HTTP e lógica compartilhada.
      - `utils/` - utilitários e helpers.
    - `pages/` - páginas da aplicação organizadas por feature (ex.: `cadastro/`, `login/`, `layout-principal/`).
    - `shared/` - componentes e recursos reutilizáveis (`components/`).

Observações sobre o frontend:

- Estrutura orientada a features: cada página/feature vive em sua própria pasta, facilitando escalar o projeto.
- Serviços em `core/services` expõem uma API clara para o restante da aplicação e concentram a comunicação com o backend.
- Componentes reutilizáveis ficam em `shared/components` para evitar duplicação.

## ▶️ Como rodar

Exemplo rápido para iniciar o backend (assumindo Node.js instalado):

1. Acesse a pasta `Backend`.
2. Instale dependências (se necessário):

```bash
cd Backend
npm install
```

3. Inicie o servidor:

```bash
npm start
```

O servidor rodará em `http://localhost:3000` por padrão (verifique `src/server.js` para porta exata).

Frontend (Angular) — comandos sugeridos dentro de `finance-dashboard`:

```bash
cd finance-dashboard
npm install
ng serve
```

### 🔁 1) Repetição de registros (fluxo)

- O job diário (`RegistroRepeticao.job.js`) obtém a hora/minuto das variáveis de ambiente `HORACRON` e `MINUTOCRON` e agenda com `node-cron`:
  - `cron.schedule(`${minuto} ${hora} * * *`, ...)` — executa todos os dias no horário configurado.
- O job chama `RepetirRegistro.executar()`, que faz:
  1. `const hoje = new Date().toISOString().split('T')[0]` (data em ISO, no fuso UTC).
  2. `registroRepository.buscarPorData(hoje)` — busca registros cuja `data` é hoje e `repeticao != 'NONE'`.
  3. Para cada registro `r` encontrado, calcula a próxima data `proximo` a partir de `r.data` com base em `r.repeticao`:
     - `DAY`  -> +1 dia
     - `WEEK` -> +7 dias
     - `MONTH`-> +1 mês
     - `YEAR` -> +1 ano
  4. Chama `CriarRegistro.execute(...)` passando os dados do registro com `data: proximo` e `repeticao: r.repeticao` para criar a nova ocorrência.

> Observação importante: o `CriarRegistro` (quando chamado sem `parcela>1`) **também cria imediatamente a próxima ocorrência** se `repeticao !== 'NONE'`. Isso significa que, quando o job processa um registro repetível, o sistema pode criar duas ocorrências futuras (efeito encadeado). Dependendo do objetivo, isso pode ser desejado (manter um buffer de ocorrências futuras) ou indesejado (duplicação).

### 📦 2) Geração automática por parcelas

- Na criação de registro (`CriarRegistro.js`), se `parcela && parcela > 1`:
  - O valor é dividido igualmente: `valor = valor / parcela`.
  - Gera-se um loop `for (i = 1..parcela)` e para cada parcela:
    - Calcula-se `proximo` com `proximo.setMonth(proximo.getMonth() + i)` — portanto as parcelas são geradas mensalmente.
    - A descrição é ajustada para `"descricao i/parcela"` e a parcela é criada via `registroRepository.criar(...)`.
  - Retorna a lista de parcelas criadas.

Observações e limitações:

- Parcelas são sempre mensais (implementação atual). Não há opção para periodicidade diferente.
- Arredondamento: a divisão direta pode criar diferenças de centavos entre soma das parcelas e valor original. Já existe a dependência `big.js` no projeto; recomenda-se usá-la para dividir e ajustar a última parcela (garantir soma igual ao total).

### ⏰ 3) O cron que roda todo dia

- Local: `Backend/src/infrastructure/jobs/RegistroRepeticao.job.js`.
- Configuração: as variáveis de ambiente `HORACRON` e `MINUTOCRON` determinam a hora e minuto da execução diária.
- Agendamento: `cron.schedule(`${minuto} ${hora} * * *`, async () => { await useCase.executar(); })`.

### 📂 4) Visibilidade das categorias (por que o cliente vê apenas as categorias padrão + as dele)

- Na inicialização do SQLite (`Backend/src/config/sqlite.js`) existe um seed que insere categorias padrão caso a tabela esteja vazia. Essas categorias são criadas com `fkCliente = NULL`.
- A consulta usada pelo repositório (`CategoriaRepositorySQLite.buscarPorFkCliente`) é:
  - `SELECT * FROM categorias WHERE fkCliente IS NULL OR fkCliente = ? ORDER BY fkCliente IS NULL, fkCliente ASC`.
- Quando o frontend chama `GET /categorias?fkCliente=123`, o controller (`CategoriasController.buscarPorFkCliente`) passa esse `fkCliente` para o use case `BuscarPorFkCliente`, que chama o repositório e retorna:
  - Todas as categorias padrão (`fkCliente IS NULL`) e as categorias específicas do cliente (`fkCliente = 123`).

Segurança/consistência:

- Operações de `UPDATE` e `DELETE` em categorias exigem `fkCliente` no `WHERE` (ex.: `UPDATE categorias SET nome = ? WHERE idCategoria = ? AND fkCliente = ?`) — isso impede que um cliente altere categorias de outro ou as padrão.

## ✅ Contribuições e próximos passos

- Adicionar documentação Swagger/OpenAPI para expor e versionar a API automaticamente.
- Adicionar testes automatizados e integração contínua (GitHub Actions).
- Deixar o Frontend responsivo para diferentes dispositivos.