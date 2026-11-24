import { Request, Response } from "express";
import { servicoService } from "../container";

export async function listarServicos(req: Request, res: Response) {
    const nome = req.query.nome?.toString();
    return res.status(200).json(await servicoService.listar(nome));
}

export async function buscarServicoPorId(req: Request, res: Response) {
    return res.status(200).json(await servicoService.buscarPorId(Number(req.params.id)));
}

export async function criarServico(req: Request, res: Response) {
    return res.status(201).json(await servicoService.criar(req.body));
}

export async function atualizarServico(req: Request, res: Response) {
    return res
        .status(200)
        .json(await servicoService.atualizar(Number(req.params.id), req.body));
}

export async function excluirServico(req: Request, res: Response) {
    await servicoService.excluir(Number(req.params.id));
    return res.status(204).send();
}
