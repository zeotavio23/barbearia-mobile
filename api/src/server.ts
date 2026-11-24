import { networkInterfaces } from "node:os";
import { app } from "./app";
import { env } from "./config/env";

// Endereços da máquina na rede local (é o que o celular usa para chamar a API)
function enderecosDaRede(): string[] {
    return Object.values(networkInterfaces())
        .flat()
        .filter((rede) => rede && rede.family === "IPv4" && !rede.internal)
        .map((rede) => rede!.address);
}

app.listen(env.porta, "0.0.0.0", () => {
    console.log(`Servidor rodando em http://localhost:${env.porta}`);
    console.log(`Swagger em http://localhost:${env.porta}/docs`);

    for (const ip of enderecosDaRede()) {
        console.log(`Na rede local (use no celular): http://${ip}:${env.porta}`);
    }
});
