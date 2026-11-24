import React from "react";
import type { Cliente } from "../api/types";
import { Campo, CrudScreen, ItemVisual } from "../components/CrudScreen";

const campos: Campo[] = [
    { chave: "nome", rotulo: "Nome", tipo: "texto", placeholder: "Ex: João Pereira" },
    { chave: "telefone", rotulo: "Telefone", tipo: "telefone", placeholder: "Ex: 24999990001" },
    { chave: "email", rotulo: "E-mail", tipo: "email", placeholder: "Ex: joao@email.com" },
];

const mostrar = (cliente: Cliente): ItemVisual => ({
    titulo: cliente.nome,
    linhas: [`Telefone: ${cliente.telefone}`, `E-mail: ${cliente.email}`],
});

export function ClientesScreen() {
    return (
        <CrudScreen<Cliente>
            nomeSingular="cliente"
            endpoint="/clientes"
            campos={campos}
            valoresIniciais={{ nome: "", telefone: "", email: "" }}
            paraFormulario={(c) => ({ nome: c.nome, telefone: c.telefone, email: c.email })}
            paraPayload={(f) => ({ nome: f.nome.trim(), telefone: f.telefone.trim(), email: f.email.trim() })}
            mostrar={mostrar}
        />
    );
}
