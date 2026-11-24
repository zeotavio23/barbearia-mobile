// Formato dos dados que a API devolve

export interface Usuario {
    id: number;
    nome: string;
    email: string;
}

export interface LoginResposta {
    token: string;
    usuario: Usuario;
}

export interface Cliente {
    id: number;
    nome: string;
    telefone: string;
    email: string;
}

export interface Barbeiro {
    id: number;
    nome: string;
    especialidade: string;
    telefone: string;
}

export interface Servico {
    id: number;
    nome: string;
    preco: number;
    duracaoMinutos: number;
}

export type StatusAgendamento = "agendado" | "confirmado" | "concluido" | "cancelado";

export interface Agendamento {
    id: number;
    clienteId: number;
    barbeiroId: number;
    servicoId: number;
    dataHora: string; // ISO 8601 (UTC)
    status: StatusAgendamento;
    cliente: { id: number; nome: string };
    barbeiro: { id: number; nome: string };
    servico: { id: number; nome: string; preco: number; duracaoMinutos: number };
}
