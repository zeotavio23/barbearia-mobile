import React from "react";
import type { Servico } from "../api/types";
import { Campo, CrudScreen, ItemVisual } from "../components/CrudScreen";
import { formatarPreco } from "../util/data";

const campos: Campo[] = [
    { chave: "nome", rotulo: "Nome do serviço", tipo: "texto", placeholder: "Ex: Corte de cabelo" },
    { chave: "preco", rotulo: "Preço (R$)", tipo: "decimal", placeholder: "Ex: 40,00" },
    { chave: "duracaoMinutos", rotulo: "Duração (minutos)", tipo: "numero", placeholder: "Ex: 30" },
];

const mostrar = (servico: Servico): ItemVisual => ({
    titulo: servico.nome,
    linhas: [formatarPreco(servico.preco), `Duração: ${servico.duracaoMinutos} min`],
});

function paraPayload(f: Record<string, string>) {
    const preco = Number(f.preco.replace(",", "."));
    const duracaoMinutos = Number(f.duracaoMinutos);

    if (f.preco.trim() === "" || Number.isNaN(preco)) throw new Error("Informe um preço válido (ex: 40,00)");
    if (f.duracaoMinutos.trim() === "" || Number.isNaN(duracaoMinutos)) {
        throw new Error("Informe a duração em minutos (ex: 30)");
    }

    return { nome: f.nome.trim(), preco, duracaoMinutos };
}

export function ServicosScreen() {
    return (
        <CrudScreen<Servico>
            nomeSingular="serviço"
            endpoint="/servicos"
            campos={campos}
            valoresIniciais={{ nome: "", preco: "", duracaoMinutos: "" }}
            paraFormulario={(s) => ({
                nome: s.nome,
                preco: String(s.preco).replace(".", ","),
                duracaoMinutos: String(s.duracaoMinutos),
            })}
            paraPayload={paraPayload}
            mostrar={mostrar}
        />
    );
}
