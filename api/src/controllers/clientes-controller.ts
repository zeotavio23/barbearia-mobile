import { Request, Response } from "express";
import { clienteService } from "../container";

export async function listarClientes(req: Request, res: Response) {
    const nome = req.query.nome?.toString();
    return res.status(200).json(await clienteService.listar(nome));
}

export async function buscarClientePorId(req: Request, res: Response) {
    return res.status(200).json(await clienteService.buscarPorId(Number(req.params.id)));
}

export async function criarCliente(req: Request, res: Response) {
    return res.status(201).json(await clienteService.criar(req.body));
}

export async function atualizarCliente(req: Request, res: Response) {
    return res
        .status(200)
        .json(await clienteService.atualizar(Number(req.params.id), req.body));
}

export async function excluirCliente(req: Request, res: Response) {
    await clienteService.excluir(Number(req.params.id));
    return res.status(204).send();
}
