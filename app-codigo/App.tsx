import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "./src/auth/AuthContext";
import { AgendamentosScreen } from "./src/screens/AgendamentosScreen";
import { BarbeirosScreen } from "./src/screens/BarbeirosScreen";
import { ClientesScreen } from "./src/screens/ClientesScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { ServicosScreen } from "./src/screens/ServicosScreen";
import { cores } from "./src/theme";

type Aba = "agenda" | "clientes" | "barbeiros" | "servicos";

const ABAS: { chave: Aba; rotulo: string; icone: string }[] = [
    { chave: "agenda", rotulo: "Agenda", icone: "📅" },
    { chave: "clientes", rotulo: "Clientes", icone: "👤" },
    { chave: "barbeiros", rotulo: "Barbeiros", icone: "💈" },
    { chave: "servicos", rotulo: "Serviços", icone: "✂️" },
];

// Tela principal (depois do login): cabeçalho, a aba escolhida e a barra de abas embaixo
function Principal() {
    const { usuario, sair } = useAuth();
    const insets = useSafeAreaInsets();
    const [aba, setAba] = useState<Aba>("agenda");

    return (
        <View style={[estilos.tela, { paddingTop: insets.top }]}>
            <View style={estilos.cabecalho}>
                <View>
                    <Text style={estilos.cabecalhoTitulo}>💈 Barbearia</Text>
                    <Text style={estilos.cabecalhoUsuario}>{usuario?.nome}</Text>
                </View>
                <Pressable onPress={() => void sair()} hitSlop={10}>
                    <Text style={estilos.sair}>Sair</Text>
                </Pressable>
            </View>

            <View style={estilos.conteudo}>
                {aba === "agenda" && <AgendamentosScreen />}
                {aba === "clientes" && <ClientesScreen />}
                {aba === "barbeiros" && <BarbeirosScreen />}
                {aba === "servicos" && <ServicosScreen />}
            </View>

            <View style={[estilos.abas, { paddingBottom: Math.max(insets.bottom, 8) }]}>
                {ABAS.map((item) => (
                    <Pressable key={item.chave} style={estilos.aba} onPress={() => setAba(item.chave)}>
                        <Text style={[estilos.abaIcone, aba !== item.chave && { opacity: 0.45 }]}>{item.icone}</Text>
                        <Text style={[estilos.abaRotulo, aba === item.chave && estilos.abaRotuloAtiva]}>
                            {item.rotulo}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}

// Decide qual tela mostrar: carregando, login ou o app
function Raiz() {
    const { carregando, usuario } = useAuth();

    if (carregando) {
        return (
            <View style={[estilos.tela, estilos.centro]}>
                <ActivityIndicator color={cores.destaque} size="large" />
            </View>
        );
    }

    return usuario ? <Principal /> : <LoginScreen />;
}

export default function App() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <StatusBar style="light" />
                <Raiz />
            </AuthProvider>
        </SafeAreaProvider>
    );
}

const estilos = StyleSheet.create({
    tela: { flex: 1, backgroundColor: cores.fundo },
    centro: { alignItems: "center", justifyContent: "center" },
    cabecalho: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: cores.borda,
    },
    cabecalhoTitulo: { color: cores.texto, fontSize: 20, fontWeight: "800" },
    cabecalhoUsuario: { color: cores.textoSuave, fontSize: 13, marginTop: 2 },
    sair: { color: cores.destaque, fontSize: 15, fontWeight: "600" },
    conteudo: { flex: 1 },
    abas: {
        flexDirection: "row",
        backgroundColor: cores.superficie,
        borderTopWidth: 1,
        borderTopColor: cores.borda,
        paddingTop: 8,
    },
    aba: { flex: 1, alignItems: "center" },
    abaIcone: { fontSize: 22 },
    abaRotulo: { color: cores.textoSuave, fontSize: 11, marginTop: 2 },
    abaRotuloAtiva: { color: cores.destaque, fontWeight: "700" },
});
