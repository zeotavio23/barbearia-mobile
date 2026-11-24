import { AppError } from "../errors/app-error";
import { gerarToken } from "../lib/jwt";
import { conferirSenha, gerarHash } from "../lib/senha";
import { UsuarioRepository } from "../repositories/usuario-repository";
import { LoginInput, RegistrarInput } from "../schemas/auth-schema";

export class AuthService {
    constructor(private readonly repository: UsuarioRepository) {}

    async registrar(dados: RegistrarInput) {
        if (await this.repository.buscarPorEmail(dados.email)) {
            throw new AppError("E-mail já cadastrado", 409);
        }

        const senhaHash = await gerarHash(dados.senha);
        return this.repository.criar({ nome: dados.nome, email: dados.email, senhaHash });
    }

    async login(dados: LoginInput) {
        const usuario = await this.repository.buscarPorEmail(dados.email);
        const senhaConfere = usuario
            ? await conferirSenha(dados.senha, usuario.senhaHash)
            : false;

        // Mesma mensagem para "e-mail não existe" e "senha errada":
        // não revela para quem está tentando qual dos dois falhou.
        if (!usuario || !senhaConfere) {
            throw new AppError("E-mail ou senha inválidos", 401);
        }

        return {
            token: gerarToken(usuario.id),
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
        };
    }

    async perfil(usuarioId: number) {
        const usuario = await this.repository.buscarPorId(usuarioId);
        if (!usuario) throw new AppError("Usuário não encontrado", 401);
        return usuario;
    }
}
