import { z } from "zod";

export const clienteInputSchema = z.object({
    nome: z
        .string({ error: "O nome é obrigatório" })
        .trim()
        .min(3, "O nome deve possuir no mínimo 3 caracteres")
        .max(100, "O nome deve possuir no máximo 100 caracteres"),
    telefone: z
        .string({ error: "O telefone é obrigatório" })
        .trim()
        .min(8, "Por favor informe um telefone válido")
        .max(20, "O telefone deve possuir no máximo 20 caracteres"),
    email: z
        .string({ error: "O e-mail é obrigatório" })
        .trim()
        .toLowerCase()
        .pipe(z.email("E-mail inválido")),
});

export type ClienteInput = z.infer<typeof clienteInputSchema>;
