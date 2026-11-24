import { prisma } from "../lib/prisma";
import { Agendamento, StatusAgendamento } from "../models/agendamento";
import { AgendamentoRepository, DadosAgendamento } from "./agendamento-repository";

// Traz junto o nome do cliente/barbeiro e os dados do serviço (JOIN)
const incluir = {
    cliente: { select: { id: true, nome: true } },
    barbeiro: { select: { id: true, nome: true } },
    servico: { select: { id: true, nome: true, preco: true, duracaoMinutos: true } },
} as const;

type Registro = {
    id: number;
    clienteId: number;
    barbeiroId: number;
    servicoId: number;
    dataHora: Date;
    status: string;
    cliente: { id: number; nome: string };
    barbeiro: { id: number; nome: string };
    servico: { id: number; nome: string; preco: number; duracaoMinutos: number };
};

function mapear(registro: Registro): Agendamento {
    return {
        id: registro.id,
        clienteId: registro.clienteId,
        barbeiroId: registro.barbeiroId,
        servicoId: registro.servicoId,
        dataHora: registro.dataHora.toISOString(),
        status: registro.status as StatusAgendamento,
        cliente: registro.cliente,
        barbeiro: registro.barbeiro,
        servico: registro.servico,
    };
}

const UM_DIA_MS = 24 * 60 * 60 * 1000;
const MINUTO_MS = 60 * 1000;

export class AgendamentoRepositoryPrisma implements AgendamentoRepository {
    async listar(): Promise<Agendamento[]> {
        const registros = await prisma.agendamento.findMany({
            orderBy: { dataHora: "asc" },
            include: incluir,
        });
        return registros.map(mapear);
    }

    async buscarPorId(id: number): Promise<Agendamento | null> {
        const registro = await prisma.agendamento.findUnique({
            where: { id },
            include: incluir,
        });
        return registro ? mapear(registro) : null;
    }

    async buscarConflito(
        barbeiroId: number,
        inicio: Date,
        fim: Date,
        ignorarId?: number
    ): Promise<Agendamento | null> {
        // Pega os agendamentos ativos do barbeiro que começam até 24h antes do
        // novo horário (a duração máxima de um serviço é 8h) e antes do fim dele...
        const candidatos = await prisma.agendamento.findMany({
            where: {
                barbeiroId,
                status: { not: "cancelado" },
                id: ignorarId ? { not: ignorarId } : undefined,
                dataHora: {
                    gt: new Date(inicio.getTime() - UM_DIA_MS),
                    lt: fim,
                },
            },
            include: incluir,
        });

        // ...e vê quais realmente se sobrepõem: começa antes do novo terminar
        // E termina depois do novo começar.
        const conflito = candidatos.find((existente) => {
            const inicioExistente = existente.dataHora.getTime();
            const fimExistente = inicioExistente + existente.servico.duracaoMinutos * MINUTO_MS;
            return inicioExistente < fim.getTime() && fimExistente > inicio.getTime();
        });

        return conflito ? mapear(conflito) : null;
    }

    async criar(dados: DadosAgendamento): Promise<Agendamento> {
        const registro = await prisma.agendamento.create({ data: dados, include: incluir });
        return mapear(registro);
    }

    async atualizar(id: number, dados: DadosAgendamento): Promise<Agendamento> {
        const registro = await prisma.agendamento.update({
            where: { id },
            data: dados,
            include: incluir,
        });
        return mapear(registro);
    }

    async excluir(id: number): Promise<void> {
        await prisma.agendamento.delete({ where: { id } });
    }
}
