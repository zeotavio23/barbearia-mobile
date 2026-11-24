import { z } from "zod";

export const servicoInputSchema = z.object({
    nome: z
        .string({ error: "O nome é obrigatório" })
        .trim()
        .min(2, "O nome deve possuir no mínimo 2 caracteres")
        .max(80, "O nome deve possuir no máximo 80 caracteres"),
    preco: z
        .number({ error: "O preço deve ser um número" })
        .positive("O preço deve ser maior que zero")
        .max(10000, "O preço deve ser no máximo 10000"),
    duracaoMinutos: z
        .number({ error: "A duração deve ser um número (em minutos)" })
        .int("A duração deve ser um número inteiro")
        .min(5, "A duração mínima é de 5 minutos")
        .max(480, "A duração máxima é de 480 minutos"),
});

export type ServicoInput = z.infer<typeof servicoInputSchema>;
