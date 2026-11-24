import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

// Senhas NUNCA são guardadas puras no banco: guardamos só um "hash"
// (resultado de uma função de mão única). Usamos o scrypt, que já vem
// no Node (módulo crypto), então não precisa instalar nada.

const TAMANHO_HASH = 64;

function derivar(senha: string, salt: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        scrypt(senha, salt, TAMANHO_HASH, (erro, chave) => {
            if (erro) reject(erro);
            else resolve(chave);
        });
    });
}

// Formato salvo no banco: "salt:hash" (os dois em hexadecimal)
export async function gerarHash(senha: string): Promise<string> {
    const salt = randomBytes(16);
    const hash = await derivar(senha, salt);
    return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export async function conferirSenha(senha: string, salvo: string): Promise<boolean> {
    const [saltHex, hashHex] = salvo.split(":");
    if (!saltHex || !hashHex) return false;

    const esperado = Buffer.from(hashHex, "hex");
    const calculado = await derivar(senha, Buffer.from(saltHex, "hex"));

    return esperado.length === calculado.length && timingSafeEqual(esperado, calculado);
}
