import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { autenticar } from "./middlewares/autenticar";
import { erroHandler } from "./middlewares/error-handler";
import { agendamentosRoutes } from "./routes/agendamentos-routes";
import { authRoutes } from "./routes/auth-routes";
import { barbeirosRoutes } from "./routes/barbeiros-routes";
import { clientesRoutes } from "./routes/clientes-routes";
import { servicosRoutes } from "./routes/servicos-routes";

const app = express();

// CORS simples: só é necessário se o app rodar no navegador (Expo Web).
// No celular (Expo Go) o React Native não passa por essa regra.
app.use((request, response, next) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");

    if (request.method === "OPTIONS") {
        response.status(204).end();
        return;
    }
    next();
});

app.use(express.json());

app.get("/", (request, response) => {
    return response.status(200).json({
        nome: "API da Barbearia",
        versao: "2.0.0",
        documentacao: "/docs",
    });
});

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        swaggerOptions: {
            persistAuthorization: true, // lembra o token se você recarregar a página
            supportedSubmitMethods: ["get", "post", "put", "patch", "delete"],
        },
    })
);

// Rotas públicas (cadastro e login)
app.use("/auth", authRoutes);

// Rotas protegidas: o middleware "autenticar" roda ANTES e exige o token JWT
app.use("/clientes", autenticar, clientesRoutes);
app.use("/barbeiros", autenticar, barbeirosRoutes);
app.use("/servicos", autenticar, servicosRoutes);
app.use("/agendamentos", autenticar, agendamentosRoutes);

app.use((request, response) => {
    response.status(404).json({ mensagem: "Rota não encontrada" });
});

app.use(erroHandler);

export { app };
