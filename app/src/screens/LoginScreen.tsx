import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { textoDoErro } from "../api/http";
import { useAuth } from "../auth/AuthContext";
import { Botao, CampoTexto, CaixaDeErro } from "../components/ui";
import { API_URL } from "../config";
import { cores } from "../theme";

export function LoginScreen() {
    const { entrar, criarConta } = useAuth();
    const insets = useSafeAreaInsets();

    const [modoCadastro, setModoCadastro] = useState(false);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState<string | null>(null);
    const [enviando, setEnviando] = useState(false);

    async function enviar() {
        setErro(null);
        setEnviando(true);
        try {
            if (modoCadastro) {
                await criarConta(nome.trim(), email.trim(), senha);
            } else {
                await entrar(email.trim(), senha);
            }
            // Deu certo: o App troca de tela sozinho quando "usuario" é preenchido
        } catch (e) {
            setErro(textoDoErro(e));
            setEnviando(false);
        }
    }

    return (
        <KeyboardAvoidingView style={estilos.tela} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView
                contentContainerStyle={[estilos.conteudo, { paddingTop: insets.top + 40 }]}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={estilos.logo}>💈</Text>
                <Text style={estilos.titulo}>Barbearia</Text>
                <Text style={estilos.subtitulo}>{modoCadastro ? "Crie sua conta" : "Entre para continuar"}</Text>

                {erro && <CaixaDeErro mensagem={erro} />}

                {modoCadastro && (
                    <CampoTexto rotulo="Nome" value={nome} onChangeText={setNome} placeholder="Seu nome" />
                )}
                <CampoTexto
                    rotulo="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="voce@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <CampoTexto
                    rotulo="Senha"
                    value={senha}
                    onChangeText={setSenha}
                    placeholder="Mínimo 6 caracteres"
                    secureTextEntry
                    autoCapitalize="none"
                />

                <Botao
                    titulo={modoCadastro ? "Criar conta" : "Entrar"}
                    onPress={() => void enviar()}
                    carregando={enviando}
                    estilo={estilos.botao}
                />
                <Botao
                    titulo={modoCadastro ? "Já tenho conta" : "Criar uma conta"}
                    tipo="secundario"
                    onPress={() => {
                        setModoCadastro(!modoCadastro);
                        setErro(null);
                    }}
                    estilo={estilos.botao}
                />

                <View style={estilos.rodape}>
                    <Text style={estilos.dica}>Login de teste: admin@barbearia.com / 123456</Text>
                    <Text style={estilos.dica}>API: {API_URL}</Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const estilos = StyleSheet.create({
    tela: { flex: 1, backgroundColor: cores.fundo },
    conteudo: { paddingHorizontal: 24, paddingBottom: 40 },
    logo: { fontSize: 56, textAlign: "center" },
    titulo: { color: cores.texto, fontSize: 30, fontWeight: "800", textAlign: "center", marginTop: 8 },
    subtitulo: { color: cores.textoSuave, fontSize: 15, textAlign: "center", marginBottom: 28, marginTop: 4 },
    botao: { marginTop: 8 },
    rodape: { marginTop: 32, alignItems: "center", gap: 4 },
    dica: { color: cores.textoSuave, fontSize: 12, textAlign: "center" },
});
