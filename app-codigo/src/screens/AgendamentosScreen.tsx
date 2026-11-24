import React from "react";
import type { Agendamento, Barbeiro, Cliente, Servico } from "../api/types";
import { Campo, CrudScreen, ItemVisual } from "../components/CrudScreen";
import { dataHoraParaISO, formatarDataHora, formatarPreco, isoParaCampos, mascaraData, mascaraHora } from "../util/data";

const NOMES_STATUS: Record<string, string> = {
    agendado: "Agendado",
    confirmado: "Confirmado",
    concluido: "Concluído",
    cancelado: "Cancelado",
};

// O agendamento é a "relação" entre os CRUDs: escolhe um cliente, um barbeiro e um serviço
// que já existem (as opções vêm da API) e define o horário.
const campos: Campo[] = [
    {
        chave: "clienteId",
        rotulo: "Cliente",
        tipo: "selecao",
        opcoesDe: { endpoint: "/clientes", rotulo: (c: Cliente) => c.nome },
    },
    {
        chave: "barbeiroId",
        rotulo: "Barbeiro",
        tipo: "selecao",
        opcoesDe: { endpoint: "/barbeiros", rotulo: (b: Barbeiro) => b.nome },
    },
    {
        chave: "servicoId",
        rotulo: "Serviço",
        tipo: "selecao",
        opcoesDe: {
            endpoint: "/servicos",
            rotulo: (s: Servico) => `${s.nome} · ${s.duracaoMinutos}min · ${formatarPreco(s.preco)}`,
        },
    },
    { chave: "data", rotulo: "Data", tipo: "numero", placeholder: "DD/MM/AAAA", mascara: mascaraData },
    { chave: "hora", rotulo: "Hora", tipo: "numero", placeholder: "HH:MM", mascara: mascaraHora },
    {
        chave: "status",
        rotulo: "Status",
        tipo: "selecao",
        opcoes: Object.entries(NOMES_STATUS).map(([valor, rotulo]) => ({ valor, rotulo })),
    },
];

const mostrar = (agendamento: Agendamento): ItemVisual => ({
    titulo: `${agendamento.cliente.nome} — ${agendamento.servico.nome}`,
    linhas: [
        `Barbeiro: ${agendamento.barbeiro.nome}`,
        formatarDataHora(agendamento.dataHora),
        `${agendamento.servico.duracaoMinutos} min · ${formatarPreco(agendamento.servico.preco)}`,
    ],
    selo: NOMES_STATUS[agendamento.status] ?? agendamento.status,
});

function paraFormulario(a: Agendamento) {
    const { data, hora } = isoParaCampos(a.dataHora);
    return {
        clienteId: String(a.clienteId),
        barbeiroId: String(a.barbeiroId),
        servicoId: String(a.servicoId),
        data,
        hora,
        status: a.status,
    };
}

function paraPayload(f: Record<string, string>) {
    if (!f.clienteId) throw new Error("Escolha o cliente");
    if (!f.barbeiroId) throw new Error("Escolha o barbeiro");
    if (!f.servicoId) throw new Error("Escolha o serviço");

    return {
        clienteId: Number(f.clienteId),
        barbeiroId: Number(f.barbeiroId),
        servicoId: Number(f.servicoId),
        dataHora: dataHoraParaISO(f.data, f.hora),
        status: f.status,
    };
}

export function AgendamentosScreen() {
    return (
        <CrudScreen<Agendamento>
            nomeSingular="agendamento"
            endpoint="/agendamentos"
            campos={campos}
            valoresIniciais={{ clienteId: "", barbeiroId: "", servicoId: "", data: "", hora: "", status: "agendado" }}
            paraFormulario={paraFormulario}
            paraPayload={paraPayload}
            mostrar={mostrar}
        />
    );
}
