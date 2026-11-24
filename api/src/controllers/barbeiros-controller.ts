import { Request, Response } from "express";
import { barbeiroService } from "../container";

export async function listarBarbeiros(req: Request, res: Response) {
    const nome = req.query.nome?.toString();
    return res.status(200).json(await barbeiroService.listar(nome));
}

export async function buscarBarbeiroPorId(req: Request, res: Response) {
    return res.status(200).json(await barbeiroService.buscarPorId(Number(req.params.id)));
}

export async function criarBarbeiro(req: Request, res: Response) {
    return res.status(201).json(await barbeiroService.criar(req.body));
}

export async function atualizarBarbeiro(req: Request, res: Response) {
    return res
        .status(200)
        .json(await barbeiroService.atualizar(Number(req.params.id), req.body));
}

export async function excluirBarbeiro(req: Request, res: Response) {
    await barbeiroService.excluir(Number(req.params.id));
    return res.status(204).send();
}
