import { z } from "zod";

export const barbeiroInputSchema = z.object({
    nome: z
        .string({ error: "O nome é obrigatório" })
        .trim()
        .min(3, "O nome deve possuir no mínimo 3 caracteres")
        .max(100, "O nome deve possuir no máximo 100 caracteres"),
    especialidade: z
        .string({ error: "A especialidade é obrigatória" })
        .trim()
        .min(3, "A especialidade deve possuir no mínimo 3 caracteres")
        .max(60, "A especialidade deve possuir no máximo 60 caracteres"),
    telefone: z
        .string({ error: "O telefone é obrigatório" })
        .trim()
        .min(8, "Por favor informe um telefone válido")
        .max(20, "O telefone deve possuir no máximo 20 caracteres"),
});

export type BarbeiroInput = z.infer<typeof barbeiroInputSchema>;
