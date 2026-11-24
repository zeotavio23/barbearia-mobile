import { prisma } from "../lib/prisma";
import { Cliente } from "../models/cliente";
import { ClienteInput } from "../schemas/cliente-schema";
import { ClienteRepository } from "./cliente-repository";

// Só os campos que a API devolve (sem criadoEm/atualizadoEm)
const campos = { id: true, nome: true, telefone: true, email: true } as const;

export class ClienteRepositoryPrisma implements ClienteRepository {
    listar(nome?: string): Promise<Cliente[]> {
        return prisma.cliente.findMany({
            where: nome ? { nome: { contains: nome } } : undefined,
            orderBy: { nome: "asc" },
            select: campos,
        });
    }

    buscarPorId(id: number): Promise<Cliente | null> {
        return prisma.cliente.findUnique({ where: { id }, select: campos });
    }

    buscarPorTelefone(telefone: string): Promise<Cliente | null> {
        return prisma.cliente.findUnique({ where: { telefone }, select: campos });
    }

    criar(dados: ClienteInput): Promise<Cliente> {
        return prisma.cliente.create({ data: dados, select: campos });
    }

    atualizar(id: number, dados: ClienteInput): Promise<Cliente> {
        return prisma.cliente.update({ where: { id }, data: dados, select: campos });
    }

    async excluir(id: number): Promise<void> {
        await prisma.cliente.delete({ where: { id } });
    }

    contarAgendamentos(id: number): Promise<number> {
        return prisma.agendamento.count({ where: { clienteId: id } });
    }
}
