// Usuário como a API devolve (sem a senha!)
export interface Usuario {
    id: number;
    nome: string;
    email: string;
}

// Usuário como está no banco (com o hash da senha). Só usado internamente.
export interface UsuarioComSenha extends Usuario {
    senhaHash: string;
}
