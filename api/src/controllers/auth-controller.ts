import { Request, Response } from "express";
import { authService } from "../container";

export async function registrar(req: Request, res: Response) {
    return res.status(201).json(await authService.registrar(req.body));
}

export async function login(req: Request, res: Response) {
    return res.status(200).json(await authService.login(req.body));
}

// Devolve os dados de quem está logado (o id vem do token, colocado pelo middleware autenticar)
export async function perfil(req: Request, res: Response) {
    return res.status(200).json(await authService.perfil(res.locals.usuarioId));
}
