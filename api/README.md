# API da Barbearia (v2)

API REST em **Node.js + TypeScript** com **4 CRUDs** (Clientes, Barbeiros, Serviços e Agendamentos),
validação com **Zod**, banco **SQLite via Prisma**, autenticação com **JWT** e documentação **Swagger**.

## Requisitos

- **Node.js 22.12+** (ou 20.19+ / 24+). Confira com `node -v` — o Prisma 7 não roda em versões mais antigas.

## Como rodar (passo a passo)

```bash
# 1. instalar as dependências (também gera o client do Prisma)
npm install

# 2. criar o arquivo de configuração
#    (no Windows/PowerShell: copy .env.example .env)
cp .env.example .env

# 3. criar o banco de dados e as tabelas
npx prisma migrate dev --name init

# 4. (opcional) popular com dados de exemplo + usuário de teste
npm run db:seed

# 5. subir o servidor
npm run dev
```

- API: `http://localhost:3000`
- Documentação / testes: `http://localhost:3000/docs`
- Login de teste (criado pelo seed): **admin@barbearia.com** / **123456**

Ao subir, o terminal mostra também o endereço da sua máquina na rede
(`http://192.168.x.x:3000`) — é esse que o celular usa para chamar a API.

## Como testar no Swagger (com login)

1. Abra `http://localhost:3000/docs`
2. Em **Autenticação → POST /auth/login**, clique em *Try it out* e *Execute*
3. Copie o valor de `token` da resposta (sem as aspas)
4. Clique no botão **Authorize** (cadeado, no topo), cole o token e confirme
5. Pronto: todas as rotas passam a funcionar (sem o token elas respondem `401`)

## Autenticação (JWT)

| Método | Rota             | Protegida | Descrição                              |
|--------|------------------|-----------|----------------------------------------|
| POST   | /auth/registrar  | não       | Cria uma conta (nome, e-mail, senha)   |
| POST   | /auth/login      | não       | Devolve `{ token, usuario }`           |
| GET    | /auth/me         | sim       | Dados de quem está logado              |

- A senha é guardada como **hash** (scrypt, nativo do Node) — nunca em texto puro.
- O token JWT é assinado com o `JWT_SECRET` do `.env` e expira em `JWT_EXPIRES_IN` (padrão 7 dias).
- As rotas protegidas exigem o header `Authorization: Bearer <token>`.
- Erros de login usam a mesma mensagem para e-mail inexistente e senha errada.

## CRUDs

Todos têm: `GET /`, `GET /:id`, `POST /`, `PUT /:id` e `DELETE /:id` (e exigem token).

| Recurso        | Campos                                                          |
|----------------|-----------------------------------------------------------------|
| `/clientes`    | nome, telefone (único), email                                   |
| `/barbeiros`   | nome, especialidade, telefone                                   |
| `/servicos`    | nome (único), preco, duracaoMinutos                             |
| `/agendamentos`| clienteId, barbeiroId, servicoId, dataHora, status              |

`GET /clientes`, `/barbeiros` e `/servicos` aceitam `?nome=` para filtrar.

### Relação entre os CRUDs

O **Agendamento** liga um Cliente, um Barbeiro e um Serviço (chaves estrangeiras no Prisma).
A listagem de agendamentos já devolve o nome do cliente e do barbeiro e os dados do serviço.

### Regras de negócio

- Telefone de cliente e nome de serviço não podem se repetir (`409`).
- Cliente, barbeiro e serviço de um agendamento precisam existir (`404`).
- O barbeiro não pode ter dois agendamentos que se **sobreponham no tempo**, considerando a
  duração do serviço: um corte de 30 min às 14:00 ocupa 14:00–14:30 (`409`). Agendamentos
  `cancelado` não ocupam horário.
- Um novo agendamento precisa ser no futuro (`400`). Ao atualizar, essa regra só vale se o
  horário for alterado — assim dá para marcar como `concluido` um atendimento que já passou.
- Não dá para excluir cliente, barbeiro ou serviço que já tenha agendamentos (`409`).

### Status do agendamento

`agendado` (padrão), `confirmado`, `concluido`, `cancelado`.

### `dataHora`

Formato ISO 8601. Aceita com ou sem fuso: `2027-01-15T14:30:00` (hora local do servidor),
`2027-01-15T17:30:00Z` ou `2027-01-15T14:30:00-03:00`. A API sempre responde em UTC (com `Z`).

## Validação com Zod

Cada recurso tem um schema em `src/schemas/`. O middleware `validar()` aplica o schema ao
`body` e aos `params` antes do controller; se falhar, responde `400`:

```json
{
  "mensagem": "Dados inválidos",
  "erros": [{ "campo": "email", "mensagem": "E-mail inválido" }]
}
```

## Arquitetura em camadas

```
src/
  prisma/
    schema.prisma        # tabelas e relações
    seed.ts              # dados de exemplo
  lib/
    prisma.ts            # conexão com o banco
    senha.ts             # hash de senha (scrypt)
    jwt.ts               # gerar/validar token
  schemas/               # validação Zod (formato dos dados de entrada)
  models/                # formato dos dados que a API devolve
  repositories/          # acesso ao banco (interface + implementação Prisma)
  services/              # regras de negócio
  controllers/           # recebem a requisição e chamam o service
  routes/                # rotas + anotações do Swagger
  middlewares/
    autenticar.ts        # exige o token JWT
    validar.ts           # aplica o schema Zod
    error-handler.ts     # respostas de erro padronizadas
  errors/app-error.ts    # erro com status HTTP
  config/                # swagger e variáveis de ambiente
  container.ts           # liga repository -> service
  app.ts / server.ts
```

Fluxo de uma requisição: `rota → autenticar (JWT) → validar (Zod) → controller → service → repository → banco`.

## Scripts

| Comando                | O que faz                                    |
|------------------------|----------------------------------------------|
| `npm run dev`          | servidor com recarga automática              |
| `npm run build`        | compila para `dist/`                         |
| `npm start`            | roda a versão compilada                      |
| `npm run db:migrate`   | cria/atualiza as tabelas (`prisma migrate`)  |
| `npm run db:seed`      | popula o banco com dados de exemplo          |

## Problemas comuns

- **`no such table`** ao subir: faltou rodar `npx prisma migrate dev --name init`.
- **`Variável JWT_SECRET não definida`**: falta o arquivo `.env` (copie o `.env.example`).
- **Celular não acessa a API**: celular e PC precisam estar na mesma rede Wi-Fi e o Firewall do
  Windows precisa permitir o Node em redes privadas.
