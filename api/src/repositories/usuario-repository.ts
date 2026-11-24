import { Usuario, UsuarioComSenha } from "../models/usuario";

export interface UsuarioRepository {
    buscarPorEmail(email: string): Promise<UsuarioComSenha | null>;
    buscarPorId(id: number): Promise<Usuario | null>;
    criar(dados: { nome: string; email: string; senhaHash: string }): Promise<Usuario>;
}
