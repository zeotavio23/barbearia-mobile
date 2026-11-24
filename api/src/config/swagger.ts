import swaggerJsdoc from "swagger-jsdoc";
import path from "node:path";

// No Windows, path.resolve() gera caminhos com "\", mas o swagger-jsdoc
// espera "/" nos glob patterns. Sem essa conversão, nenhuma rota é
// encontrada e o Swagger fica sem nenhum endpoint listado.
function globDeRotas(padrao: string): string {
    return path.resolve(process.cwd(), padrao).split(path.sep).join("/");
}

const statusAgendamento = ["agendado", "confirmado", "concluido", "cancelado"];

const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API da Barbearia",
            version: "2.0.0",
            description:
                "API desenvolvida para a disciplina de desenvolvimento mobile (Node.js + TypeScript + Zod + Prisma + JWT).\n\n" +
                "**Como testar as rotas protegidas:** faça login em `POST /auth/login`, copie o `token` da resposta, " +
                "clique em **Authorize** (cadeado) e cole o token.",
        },
        servers: [{ url: "/", description: "Este servidor" }],
        tags: [
            { name: "Autenticação", description: "Cadastro e login (JWT)" },
            { name: "Clientes", description: "Operações relacionadas aos clientes" },
            { name: "Barbeiros", description: "Operações relacionadas aos barbeiros" },
            { name: "Serviços", description: "Operações relacionadas aos serviços" },
            { name: "Agendamentos", description: "Operações relacionadas aos agendamentos" },
        ],
        // Todas as rotas exigem token, exceto as que declaram "security: []"
        security: [{ bearerAuth: [] }],
        components: {
            securitySchemes: {
                bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
            },
            responses: {
                NaoAutorizado: {
                    description: "Token ausente, inválido ou expirado",
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/MensagemErro" },
                        },
                    },
                },
            },
            schemas: {
                Cliente: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        nome: { type: "string", example: "João Pereira" },
                        telefone: { type: "string", example: "24999990001" },
                        email: { type: "string", example: "joao.pereira@email.com" },
                    },
                },
                ClienteInput: {
                    type: "object",
                    required: ["nome", "telefone", "email"],
                    properties: {
                        nome: { type: "string", example: "Carlos Souza" },
                        telefone: { type: "string", example: "24999990003" },
                        email: { type: "string", example: "carlos@email.com" },
                    },
                },
                Barbeiro: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        nome: { type: "string", example: "Rafael Lima" },
                        especialidade: { type: "string", example: "Corte e Barba" },
                        telefone: { type: "string", example: "24999991001" },
                    },
                },
                BarbeiroInput: {
                    type: "object",
                    required: ["nome", "especialidade", "telefone"],
                    properties: {
                        nome: { type: "string", example: "Rafael Lima" },
                        especialidade: { type: "string", example: "Corte e Barba" },
                        telefone: { type: "string", example: "24999991001" },
                    },
                },
                Servico: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        nome: { type: "string", example: "Corte de cabelo" },
                        preco: { type: "number", example: 40 },
                        duracaoMinutos: { type: "integer", example: 30 },
                    },
                },
                ServicoInput: {
                    type: "object",
                    required: ["nome", "preco", "duracaoMinutos"],
                    properties: {
                        nome: { type: "string", example: "Corte de cabelo" },
                        preco: { type: "number", example: 40 },
                        duracaoMinutos: { type: "integer", example: 30 },
                    },
                },
                Agendamento: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        clienteId: { type: "integer", example: 1 },
                        barbeiroId: { type: "integer", example: 1 },
                        servicoId: { type: "integer", example: 1 },
                        dataHora: {
                            type: "string",
                            format: "date-time",
                            example: "2027-01-15T17:30:00.000Z",
                        },
                        status: { type: "string", enum: statusAgendamento, example: "agendado" },
                        cliente: {
                            type: "object",
                            properties: {
                                id: { type: "integer", example: 1 },
                                nome: { type: "string", example: "João Pereira" },
                            },
                        },
                        barbeiro: {
                            type: "object",
                            properties: {
                                id: { type: "integer", example: 1 },
                                nome: { type: "string", example: "Rafael Lima" },
                            },
                        },
                        servico: {
                            type: "object",
                            properties: {
                                id: { type: "integer", example: 1 },
                                nome: { type: "string", example: "Corte de cabelo" },
                                preco: { type: "number", example: 40 },
                                duracaoMinutos: { type: "integer", example: 30 },
                            },
                        },
                    },
                },
                AgendamentoInput: {
                    type: "object",
                    required: ["clienteId", "barbeiroId", "servicoId", "dataHora"],
                    properties: {
                        clienteId: { type: "integer", example: 1 },
                        barbeiroId: { type: "integer", example: 1 },
                        servicoId: { type: "integer", example: 1 },
                        dataHora: {
                            type: "string",
                            format: "date-time",
                            example: "2027-01-15T14:30:00",
                        },
                        status: { type: "string", enum: statusAgendamento, example: "agendado" },
                    },
                },
                Usuario: {
                    type: "object",
                    properties: {
                        id: { type: "integer", example: 1 },
                        nome: { type: "string", example: "Administrador" },
                        email: { type: "string", example: "admin@barbearia.com" },
                    },
                },
                RegistrarInput: {
                    type: "object",
                    required: ["nome", "email", "senha"],
                    properties: {
                        nome: { type: "string", example: "Administrador" },
                        email: { type: "string", example: "admin@barbearia.com" },
                        senha: { type: "string", example: "123456" },
                    },
                },
                LoginInput: {
                    type: "object",
                    required: ["email", "senha"],
                    properties: {
                        email: { type: "string", example: "admin@barbearia.com" },
                        senha: { type: "string", example: "123456" },
                    },
                },
                LoginResposta: {
                    type: "object",
                    properties: {
                        token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                        usuario: { $ref: "#/components/schemas/Usuario" },
                    },
                },
                MensagemErro: {
                    type: "object",
                    properties: {
                        mensagem: { type: "string", example: "Cliente não encontrado" },
                    },
                },
            },
        },
    },
    apis: [globDeRotas("src/routes/*.ts"), globDeRotas("dist/routes/*.js")],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
export { swaggerSpec };
