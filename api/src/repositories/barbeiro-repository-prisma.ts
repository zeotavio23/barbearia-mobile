import { prisma } from "../lib/prisma";
import { Barbeiro } from "../models/barbeiro";
import { BarbeiroInput } from "../schemas/barbeiro-schema";
import { BarbeiroRepository } from "./barbeiro-repository";

const campos = { id: true, nome: true, especialidade: true, telefone: true } as const;

export class BarbeiroRepositoryPrisma implements BarbeiroRepository {
    listar(nome?: string): Promise<Barbeiro[]> {
        return prisma.barbeiro.findMany({
            where: nome ? { nome: { contains: nome } } : undefined,
            orderBy: { nome: "asc" },
            select: campos,
        });
    }

    buscarPorId(id: number): Promise<Barbeiro | null> {
        return prisma.barbeiro.findUnique({ where: { id }, select: campos });
    }

    criar(dados: BarbeiroInput): Promise<Barbeiro> {
        return prisma.barbeiro.create({ data: dados, select: campos });
    }

    atualizar(id: number, dados: BarbeiroInput): Promise<Barbeiro> {
        return prisma.barbeiro.update({ where: { id }, data: dados, select: campos });
    }

    async excluir(id: number): Promise<void> {
        await prisma.barbeiro.delete({ where: { id } });
    }

    contarAgendamentos(id: number): Promise<number> {
        return prisma.agendamento.count({ where: { barbeiroId: id } });
    }
}
