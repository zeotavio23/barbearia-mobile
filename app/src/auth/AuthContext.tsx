import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { definirAoSessaoExpirar, definirToken, http } from "../api/http";
import type { LoginResposta, Usuario } from "../api/types";

const CHAVE_TOKEN = "barbearia:token";

interface AuthContextValor {
    carregando: boolean; // true enquanto verifica se já existe login salvo
    usuario: Usuario | null;
    entrar: (email: string, senha: string) => Promise<void>;
    criarConta: (nome: string, email: string, senha: string) => Promise<void>;
    sair: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValor | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [carregando, setCarregando] = useState(true);
    const [usuario, setUsuario] = useState<Usuario | null>(null);

    const sair = useCallback(async () => {
        definirToken(null);
        setUsuario(null);
        try {
            await AsyncStorage.removeItem(CHAVE_TOKEN);
        } catch {
            // sem problema: o token só deixa de ser lembrado
        }
    }, []);

    // Se a API disser que o token não vale mais (401), volta para a tela de login
    useEffect(() => {
        definirAoSessaoExpirar(() => {
            void sair();
        });
        return () => definirAoSessaoExpirar(null);
    }, [sair]);

    // Ao abrir o app: se tem token salvo, confere com a API se ainda é válido
    useEffect(() => {
        async function restaurarSessao() {
            try {
                const salvo = await AsyncStorage.getItem(CHAVE_TOKEN);
                if (salvo) {
                    definirToken(salvo);
                    setUsuario(await http<Usuario>("GET", "/auth/me"));
                }
            } catch {
                // API fora do ar ou token inválido: pede o login de novo
                definirToken(null);
            } finally {
                setCarregando(false);
            }
        }
        void restaurarSessao();
    }, []);

    const entrar = useCallback(async (email: string, senha: string) => {
        const resposta = await http<LoginResposta>("POST", "/auth/login", { email, senha });

        definirToken(resposta.token);
        try {
            await AsyncStorage.setItem(CHAVE_TOKEN, resposta.token);
        } catch {
            // sem problema: o login só não será lembrado ao fechar o app
        }
        setUsuario(resposta.usuario);
    }, []);

    const criarConta = useCallback(
        async (nome: string, email: string, senha: string) => {
            await http("POST", "/auth/registrar", { nome, email, senha });
            await entrar(email, senha);
        },
        [entrar]
    );

    const valor = useMemo(
        () => ({ carregando, usuario, entrar, criarConta, sair }),
        [carregando, usuario, entrar, criarConta, sair]
    );

    return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValor {
    const contexto = useContext(AuthContext);
    if (!contexto) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
    return contexto;
}
