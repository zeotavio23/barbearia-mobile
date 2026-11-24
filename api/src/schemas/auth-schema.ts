import { z } from "zod";

export const registrarSchema = z.object({
    nome: z
        .string({ error: "O nome é obrigatório" })
        .trim()
        .min(3, "O nome deve possuir no mínimo 3 caracteres")
        .max(100, "O nome deve possuir no máximo 100 caracteres"),
    email: z
        .string({ error: "O e-mail é obrigatório" })
        .trim()
        .toLowerCase()
        .pipe(z.email("E-mail inválido")),
    senha: z
        .string({ error: "A senha é obrigatória" })
        .min(6, "A senha deve possuir no mínimo 6 caracteres")
        .max(72, "A senha deve possuir no máximo 72 caracteres"),
});

export const loginSchema = z.object({
    email: z
        .string({ error: "O e-mail é obrigatório" })
        .trim()
        .toLowerCase()
        .pipe(z.email("E-mail inválido")),
    senha: z
        .string({ error: "A senha é obrigatória" })
        .min(1, "A senha é obrigatória"),
});

export type RegistrarInput = z.infer<typeof registrarSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
