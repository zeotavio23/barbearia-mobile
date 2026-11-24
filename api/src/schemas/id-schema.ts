import { z } from "zod";

// Valida o :id da URL (vem como texto e é convertido para número)
export const idSchema = z.object({
    id: z.coerce
        .number({ error: "O id deve ser um número" })
        .int("O id deve ser um número inteiro")
        .positive("O id deve ser positivo"),
});
