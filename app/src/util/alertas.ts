import { Alert, Platform } from "react-native";

// No navegador (Expo Web) o Alert do React Native não funciona; usamos o do próprio navegador.
const navegador = globalThis as unknown as {
    alert: (mensagem: string) => void;
    confirm: (mensagem: string) => boolean;
};

export function avisar(titulo: string, mensagem: string): void {
    if (Platform.OS === "web") {
        navegador.alert(`${titulo}\n\n${mensagem}`);
        return;
    }
    Alert.alert(titulo, mensagem);
}

// Pergunta "tem certeza?" e devolve true (confirmou) ou false (cancelou)
export function confirmar(titulo: string, mensagem: string, textoConfirmar = "Excluir"): Promise<boolean> {
    if (Platform.OS === "web") {
        return Promise.resolve(navegador.confirm(`${titulo}\n\n${mensagem}`));
    }

    return new Promise((resolve) => {
        Alert.alert(
            titulo,
            mensagem,
            [
                { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
                { text: textoConfirmar, style: "destructive", onPress: () => resolve(true) },
            ],
            { cancelable: true, onDismiss: () => resolve(false) }
        );
    });
}

// "João" -> "joao": para a busca ignorar acento e maiúscula
export function normalizar(texto: string): string {
    return texto
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase();
}
