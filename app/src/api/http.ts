import { API_URL } from "../config";

// Erro lançado quando a API responde com falha (ou não responde)
export class ApiError extends Error {
    constructor(
        mensagem: string,
        public readonly status: number,
        public readonly detalhes: string[] = []
    ) {
        super(mensagem);
    }
}

// O token JWT fica guardado aqui e é enviado em TODA requisição
let token: string | null = null;
let aoSessaoExpirar: (() => void) | null = null;

export function definirToken(novo: string | null) {
    token = novo;
}

// Chamado quando a API responde 401 com um token salvo (ex: token expirou)
export function definirAoSessaoExpirar(funcao: (() => void) | null) {
    aoSessaoExpirar = funcao;
}

type Metodo = "GET" | "POST" | "PUT" | "DELETE";

export async function http<T = unknown>(metodo: Metodo, caminho: string, corpo?: unknown): Promise<T> {
    let resposta: Response;

    try {
        resposta = await fetch(`${API_URL}${caminho}`, {
            method: metodo,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: corpo === undefined ? undefined : JSON.stringify(corpo),
        });
    } catch {
        throw new ApiError(
            `Não foi possível conectar à API (${API_URL}).\n` +
                "Confira se o servidor está rodando e se o celular está na mesma rede Wi-Fi do computador.",
            0
        );
    }

    if (resposta.status === 204) return undefined as T;

    const texto = await resposta.text();
    let dados: any = undefined;
    try {
        dados = texto ? JSON.parse(texto) : undefined;
    } catch {
        // resposta que não é JSON (ex: servidor errado na porta)
    }

    if (!resposta.ok) {
        if (resposta.status === 401 && token) aoSessaoExpirar?.();

        // A API manda { mensagem, erros: [{ campo, mensagem }] } quando o Zod reprova
        const detalhes: string[] = Array.isArray(dados?.erros)
            ? dados.erros.map((erro: { mensagem: string }) => erro.mensagem)
            : [];

        throw new ApiError(dados?.mensagem ?? `Erro inesperado (código ${resposta.status})`, resposta.status, detalhes);
    }

    return dados as T;
}

// Transforma qualquer erro em um texto para mostrar na tela
export function textoDoErro(erro: unknown): string {
    if (erro instanceof ApiError) {
        return erro.detalhes.length > 0
            ? `${erro.message}\n• ${erro.detalhes.join("\n• ")}`
            : erro.message;
    }
    if (erro instanceof Error) return erro.message;
    return "Ocorreu um erro inesperado";
}
