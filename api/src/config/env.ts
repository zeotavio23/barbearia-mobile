import "dotenv/config";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error(
        "Variável JWT_SECRET não definida. Crie o arquivo .env (veja o .env.example)."
    );
}

export const env = {
    porta: Number(process.env.PORT ?? 3000),
    jwtSecret,
    jwtExpiraEm: process.env.JWT_EXPIRES_IN ?? "7d",
};
