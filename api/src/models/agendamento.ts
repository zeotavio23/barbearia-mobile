export const STATUS_AGENDAMENTO = ["agendado", "confirmado", "concluido", "cancelado"] as const;

export type StatusAgendamento = (typeof STATUS_AGENDAMENTO)[number];

// O agendamento já vem com o nome do cliente, do barbeiro e os dados do
// serviço, para o app mostrar a lista sem precisar de várias requisições.
export interface Agendamento {
    id: number;
    clienteId: number;
    barbeiroId: number;
    servicoId: number;
    dataHora: string; // ISO 8601, ex: 2026-12-20T17:30:00.000Z
    status: StatusAgendamento;
    cliente: { id: number; nome: string };
    barbeiro: { id: number; nome: string };
    servico: { id: number; nome: string; preco: number; duracaoMinutos: number };
}
