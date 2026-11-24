import { Agendamento, StatusAgendamento } from "../models/agendamento";

// Dados que o repositório grava (a data já convertida para Date)
export interface DadosAgendamento {
    clienteId: number;
    barbeiroId: number;
    servicoId: number;
    dataHora: Date;
    status: StatusAgendamento;
}

export interface AgendamentoRepository {
    listar(): Promise<Agendamento[]>;
    buscarPorId(id: number): Promise<Agendamento | null>;
    // Procura um agendamento ativo do barbeiro que se sobreponha ao intervalo [inicio, fim)
    buscarConflito(
        barbeiroId: number,
        inicio: Date,
        fim: Date,
        ignorarId?: number
    ): Promise<Agendamento | null>;
    criar(dados: DadosAgendamento): Promise<Agendamento>;
    atualizar(id: number, dados: DadosAgendamento): Promise<Agendamento>;
    excluir(id: number): Promise<void>;
}
