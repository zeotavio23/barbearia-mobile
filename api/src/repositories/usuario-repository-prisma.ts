import { prisma } from "../lib/prisma";
import { Usuario, UsuarioComSenha } from "../models/usuario";
import { UsuarioRepository } from "./usuario-repository";

const campos = { id: true, nome: true, email: true } as const;

export class UsuarioRepositoryPrisma implements UsuarioRepository {
    buscarPorEmail(email: string): Promise<UsuarioComSenha | null> {
        return prisma.usuario.findUnique({
            where: { email },
            select: { ...campos, senhaHash: true },
        });
    }

    buscarPorId(id: number): Promise<Usuario | null> {
        return prisma.usuario.findUnique({ where: { id }, select: campos });
    }

    criar(dados: { nome: string; email: string; senhaHash: string }): Promise<Usuario> {
        return prisma.usuario.create({ data: dados, select: campos });
    }
}
