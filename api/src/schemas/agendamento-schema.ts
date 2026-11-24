import { z } from "zod";
import { STATUS_AGENDAMENTO } from "../models/agendamento";

const idObrigatorio = (nomeCampo: string) =>
    z
        .number({ error: `O ${nomeCampo} é obrigatório e deve ser um número` })
        .int(`O ${nomeCampo} deve ser um número inteiro`)
        .positive(`O ${nomeCampo} deve ser positivo`);

export const agendamentoInputSchema = z.object({
    clienteId: idObrigatorio("clienteId"),
    barbeiroId: idObrigatorio("barbeiroId"),
    servicoId: idObrigatorio("servicoId"),
    dataHora: z.iso.datetime({
        local: true, // aceita sem o "Z" no final: 2026-12-20T14:30:00
        offset: true, // aceita fuso: 2026-12-20T14:30:00-03:00
        error: "Informe a data/hora no formato ISO (ex: 2026-12-20T14:30:00)",
    }),
    status: z
        .enum(STATUS_AGENDAMENTO, {
            error: "Status deve ser: agendado, confirmado, concluido ou cancelado",
        })
        .default("agendado"),
});

export type AgendamentoInput = z.infer<typeof agendamentoInputSchema>;
