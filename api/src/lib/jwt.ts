import { sign, verify, type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

// O token JWT carrega o id do usuário no campo padrão "sub" (subject).
// Ele é assinado com o JWT_SECRET: se alguém alterar o conteúdo,
// a assinatura deixa de bater e o verify() recusa o token.

export function gerarToken(usuarioId: number): string {
    return sign({}, env.jwtSecret, {
        subject: String(usuarioId),
        expiresIn: env.jwtExpiraEm as SignOptions["expiresIn"],
    });
}

// Devolve o id do usuário ou lança erro se o token for inválido/expirado
export function validarToken(token: string): number {
    const payload = verify(token, env.jwtSecret);

    if (typeof payload === "string" || !payload.sub) {
        throw new Error("Token sem identificação de usuário");
    }

    const usuarioId = Number(payload.sub);
    if (!Number.isInteger(usuarioId)) {
        throw new Error("Identificação de usuário inválida");
    }

    return usuarioId;
}
