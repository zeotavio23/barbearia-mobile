import React from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from "react-native";
import { cores } from "../theme";

type TipoBotao = "primario" | "secundario" | "perigo";

interface BotaoProps {
    titulo: string;
    onPress: () => void;
    tipo?: TipoBotao;
    carregando?: boolean;
    desabilitado?: boolean;
    estilo?: StyleProp<ViewStyle>;
}

export function Botao({ titulo, onPress, tipo = "primario", carregando = false, desabilitado = false, estilo }: BotaoProps) {
    const bloqueado = carregando || desabilitado;

    return (
        <Pressable
            onPress={onPress}
            disabled={bloqueado}
            style={({ pressed }) => [
                estilos.botao,
                estilos[tipo],
                pressed && { opacity: 0.8 },
                bloqueado && { opacity: 0.5 },
                estilo,
            ]}
        >
            {carregando ? (
                <ActivityIndicator color={tipo === "primario" ? cores.fundo : cores.texto} />
            ) : (
                <Text style={[estilos.botaoTexto, tipo === "primario" && { color: cores.fundo }]}>{titulo}</Text>
            )}
        </Pressable>
    );
}

interface CampoTextoProps extends TextInputProps {
    rotulo: string;
}

export function CampoTexto({ rotulo, style, ...resto }: CampoTextoProps) {
    return (
        <View style={estilos.campo}>
            <Text style={estilos.rotulo}>{rotulo}</Text>
            <TextInput
                placeholderTextColor={cores.textoSuave}
                autoCorrect={false}
                style={[estilos.input, style]}
                {...resto}
            />
        </View>
    );
}

interface ChipProps {
    texto: string;
    selecionado: boolean;
    onPress: () => void;
}

// "Botãozinho" de escolha (usado para selecionar cliente, barbeiro, serviço, status)
export function Chip({ texto, selecionado, onPress }: ChipProps) {
    return (
        <Pressable onPress={onPress} style={[estilos.chip, selecionado && estilos.chipSelecionado]}>
            <Text style={[estilos.chipTexto, selecionado && { color: cores.fundo, fontWeight: "700" }]}>{texto}</Text>
        </Pressable>
    );
}

export function Selo({ texto }: { texto: string }) {
    return (
        <View style={estilos.selo}>
            <Text style={estilos.seloTexto}>{texto}</Text>
        </View>
    );
}

export function CaixaDeErro({ mensagem }: { mensagem: string }) {
    return (
        <View style={estilos.caixaErro}>
            <Text style={estilos.caixaErroTexto}>{mensagem}</Text>
        </View>
    );
}

const estilos = StyleSheet.create({
    botao: {
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 44,
    },
    primario: { backgroundColor: cores.destaque },
    secundario: { backgroundColor: cores.superficieClara },
    perigo: { backgroundColor: cores.perigo },
    botaoTexto: { color: cores.texto, fontSize: 15, fontWeight: "600" },

    campo: { marginBottom: 14 },
    rotulo: { color: cores.textoSuave, fontSize: 13, marginBottom: 6 },
    input: {
        backgroundColor: cores.superficieClara,
        color: cores.texto,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: cores.borda,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 16,
    },

    chip: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: cores.superficieClara,
        borderWidth: 1,
        borderColor: cores.borda,
        marginRight: 8,
        marginBottom: 8,
    },
    chipSelecionado: { backgroundColor: cores.destaque, borderColor: cores.destaque },
    chipTexto: { color: cores.texto, fontSize: 14 },

    selo: {
        alignSelf: "flex-start",
        backgroundColor: cores.superficieClara,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
        marginTop: 6,
    },
    seloTexto: { color: cores.destaque, fontSize: 12, fontWeight: "600" },

    caixaErro: {
        backgroundColor: "#3a1f1f",
        borderColor: cores.perigo,
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        marginBottom: 14,
    },
    caixaErroTexto: { color: "#ffb4ae", fontSize: 14 },
});
