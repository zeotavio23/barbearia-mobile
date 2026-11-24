import Constants from "expo-constants";

// Se a descoberta automática não funcionar, escreva o endereço da API aqui.
// Exemplo: "http://192.168.0.10:3000"  (o IP aparece no terminal da API)
const API_URL_MANUAL = "";

const PORTA_DA_API = 3000;

function descobrirApiUrl(): string {
    if (API_URL_MANUAL) return API_URL_MANUAL;

    // Quando você roda "npx expo start", o Expo sabe o IP do seu computador
    // (é por esse IP que o celular baixa o app). Como a API roda no mesmo
    // computador, só trocamos a porta do Expo pela porta da API.
    const hostUri = Constants.expoConfig?.hostUri; // ex: "192.168.0.10:8081"
    const ip = hostUri?.split(":")[0];

    return ip ? `http://${ip}:${PORTA_DA_API}` : `http://localhost:${PORTA_DA_API}`;
}

export const API_URL = descobrirApiUrl();
