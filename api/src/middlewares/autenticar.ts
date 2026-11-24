import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";
import { validarToken } from "../lib/jwt";

// Protege as rotas: só deixa passar quem mandar o header
//   Authorization: Bearer <token>
// com um token JWT válido (o que foi devolvido no login).
export function autenticar(request: Request, response: Response, next: NextFunction) {
    const cabecalho = request.headers.authorization;

    if (!cabecalho || !cabecalho.startsWith("Bearer ")) {
        throw new AppError("Token não informado", 401);
    }

    const token = cabecalho.slice("Bearer ".length).trim();

    try {
        response.locals.usuarioId = validarToken(token);
    } catch {
        throw new AppError("Token inválido ou expirado", 401);
    }

    next();
}
