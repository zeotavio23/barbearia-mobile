import { prisma } from "../lib/prisma";
import { Servico } from "../models/servico";
import { ServicoInput } from "../schemas/servico-schema";
import { ServicoRepository } from "./servico-repository";

const campos = { id: true, nome: true, preco: true, duracaoMinutos: true } as const;

export class ServicoRepositoryPrisma implements ServicoRepository {
    listar(nome?: string): Promise<Servico[]> {
        return prisma.servico.findMany({
            where: nome ? { nome: { contains: nome } } : undefined,
            orderBy: { nome: "asc" },
            select: campos,
        });
    }

    buscarPorId(id: number): Promise<Servico | null> {
        return prisma.servico.findUnique({ where: { id }, select: campos });
    }

    buscarPorNome(nome: string): Promise<Servico | null> {
        return prisma.servico.findUnique({ where: { nome }, select: campos });
    }

    criar(dados: ServicoInput): Promise<Servico> {
        return prisma.servico.create({ data: dados, select: campos });
    }

    atualizar(id: number, dados: ServicoInput): Promise<Servico> {
        return prisma.servico.update({ where: { id }, data: dados, select: campos });
    }

    async excluir(id: number): Promise<void> {
        await prisma.servico.delete({ where: { id } });
    }

    contarAgendamentos(id: number): Promise<number> {
        return prisma.agendamento.count({ where: { servicoId: id } });
    }
}
