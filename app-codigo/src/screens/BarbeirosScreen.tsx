import React from "react";
import type { Barbeiro } from "../api/types";
import { Campo, CrudScreen, ItemVisual } from "../components/CrudScreen";

const campos: Campo[] = [
    { chave: "nome", rotulo: "Nome", tipo: "texto", placeholder: "Ex: Rafael Lima" },
    { chave: "especialidade", rotulo: "Especialidade", tipo: "texto", placeholder: "Ex: Corte e Barba" },
    { chave: "telefone", rotulo: "Telefone", tipo: "telefone", placeholder: "Ex: 24999991001" },
];

const mostrar = (barbeiro: Barbeiro): ItemVisual => ({
    titulo: barbeiro.nome,
    linhas: [`Especialidade: ${barbeiro.especialidade}`, `Telefone: ${barbeiro.telefone}`],
});

export function BarbeirosScreen() {
    return (
        <CrudScreen<Barbeiro>
            nomeSingular="barbeiro"
            endpoint="/barbeiros"
            campos={campos}
            valoresIniciais={{ nome: "", especialidade: "", telefone: "" }}
            paraFormulario={(b) => ({ nome: b.nome, especialidade: b.especialidade, telefone: b.telefone })}
            paraPayload={(f) => ({
                nome: f.nome.trim(),
                especialidade: f.especialidade.trim(),
                telefone: f.telefone.trim(),
            })}
            mostrar={mostrar}
        />
    );
}
