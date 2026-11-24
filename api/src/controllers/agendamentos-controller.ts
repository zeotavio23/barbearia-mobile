import { Request, Response } from "express";
import { agendamentoService } from "../container";

export async function listarAgendamentos(req: Request, res: Response) {
    return res.status(200).json(await agendamentoService.listar());
}

export async function buscarAgendamentoPorId(req: Request, res: Response) {
    return res.status(200).json(await agendamentoService.buscarPorId(Number(req.params.id)));
}

export async function criarAgendamento(req: Request, res: Response) {
    return res.status(201).json(await agendamentoService.criar(req.body));
}

export async function atualizarAgendamento(req: Request, res: Response) {
    return res
        .status(200)
        .json(await agendamentoService.atualizar(Number(req.params.id), req.body));
}

export async function excluirAgendamento(req: Request, res: Response) {
    await agendamentoService.excluir(Number(req.params.id));
    return res.status(204).send();
}
