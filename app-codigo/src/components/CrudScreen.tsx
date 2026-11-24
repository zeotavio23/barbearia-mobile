import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { http, textoDoErro } from "../api/http";
import { cores } from "../theme";
import { avisar, confirmar, normalizar } from "../util/alertas";
import { Botao, CampoTexto, CaixaDeErro, Chip, Selo } from "./ui";

// Uma opção de escolha (ex: um cliente na lista de clientes)
export interface Opcao {
    valor: string;
    rotulo: string;
}

// Descreve um campo do formulário
export interface Campo {
    chave: string;
    rotulo: string;
    tipo: "texto" | "email" | "telefone" | "numero" | "decimal" | "selecao";
    placeholder?: string;
    mascara?: (texto: string) => string; // formata enquanto digita (ex: data)
    opcoes?: Opcao[]; // opções fixas (ex: status)
    opcoesDe?: { endpoint: string; rotulo: (item: any) => string }; // opções que vêm da API (ex: clientes)
}

// Como cada item aparece na lista
export interface ItemVisual {
    titulo: string;
    linhas: string[];
    selo?: string;
}

type Formulario = Record<string, string>;

interface CrudScreenProps<T extends { id: number }> {
    nomeSingular: string; // "cliente"
    endpoint: string; // "/clientes"
    campos: Campo[];
    valoresIniciais: Formulario;
    paraFormulario: (item: T) => Formulario; // item da API -> valores do formulário (editar)
    paraPayload: (form: Formulario) => unknown; // valores do formulário -> corpo da requisição
    mostrar: (item: T) => ItemVisual;
}

const TECLADO = {
    texto: "default",
    email: "email-address",
    telefone: "phone-pad",
    numero: "number-pad",
    decimal: "decimal-pad",
} as const;

// Tela genérica de CRUD: lista (GET), busca, criar (POST), editar (PUT) e excluir (DELETE).
// Cada entidade (clientes, barbeiros...) só descreve seus campos e como mostrar os itens.
export function CrudScreen<T extends { id: number }>({
    nomeSingular,
    endpoint,
    campos,
    valoresIniciais,
    paraFormulario,
    paraPayload,
    mostrar,
}: CrudScreenProps<T>) {
    const [itens, setItens] = useState<T[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erroLista, setErroLista] = useState<string | null>(null);
    const [busca, setBusca] = useState("");

    const [formAberto, setFormAberto] = useState(false);
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [form, setForm] = useState<Formulario>(valoresIniciais);
    const [erroForm, setErroForm] = useState<string | null>(null);
    const [salvando, setSalvando] = useState(false);
    const [opcoesApi, setOpcoesApi] = useState<Record<string, Opcao[]>>({});

    // GET da lista
    const carregar = useCallback(async () => {
        try {
            setErroLista(null);
            setItens(await http<T[]>("GET", endpoint));
        } catch (erro) {
            setErroLista(textoDoErro(erro));
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    }, [endpoint]);

    useEffect(() => {
        void carregar();
    }, [carregar]);

    // Busca local (ignora acento e maiúscula)
    const itensFiltrados = useMemo(() => {
        const termo = normalizar(busca.trim());
        if (!termo) return itens;
        return itens.filter((item) => {
            const visual = mostrar(item);
            return normalizar([visual.titulo, ...visual.linhas].join(" ")).includes(termo);
        });
    }, [itens, busca, mostrar]);

    // Carrega as listas usadas nos campos de escolha (ex: clientes, barbeiros e serviços do agendamento)
    async function carregarOpcoes() {
        const resultado: Record<string, Opcao[]> = {};

        await Promise.all(
            campos
                .filter((campo) => campo.opcoesDe)
                .map(async (campo) => {
                    try {
                        const lista = await http<any[]>("GET", campo.opcoesDe!.endpoint);
                        resultado[campo.chave] = lista.map((item) => ({
                            valor: String(item.id),
                            rotulo: campo.opcoesDe!.rotulo(item),
                        }));
                    } catch {
                        resultado[campo.chave] = [];
                    }
                })
        );

        setOpcoesApi(resultado);
    }

    function abrirFormulario(item?: T) {
        setEditandoId(item ? item.id : null);
        setForm(item ? paraFormulario(item) : valoresIniciais);
        setErroForm(null);
        setFormAberto(true);
        void carregarOpcoes();
    }

    // POST (novo) ou PUT (editar)
    async function salvar() {
        let payload: unknown;
        try {
            payload = paraPayload(form);
        } catch (erro) {
            setErroForm(erro instanceof Error ? erro.message : "Dados inválidos");
            return;
        }

        setSalvando(true);
        setErroForm(null);
        try {
            if (editandoId === null) {
                await http("POST", endpoint, payload);
            } else {
                await http("PUT", `${endpoint}/${editandoId}`, payload);
            }
            setFormAberto(false);
            await carregar();
        } catch (erro) {
            setErroForm(textoDoErro(erro));
        } finally {
            setSalvando(false);
        }
    }

    // DELETE
    async function excluir(item: T) {
        const nome = mostrar(item).titulo;
        const confirmou = await confirmar(`Excluir ${nomeSingular}`, `Deseja excluir "${nome}"?`);
        if (!confirmou) return;

        try {
            await http("DELETE", `${endpoint}/${item.id}`);
            await carregar();
        } catch (erro) {
            avisar("Não foi possível excluir", textoDoErro(erro));
        }
    }

    function renderCampo(campo: Campo) {
        if (campo.tipo === "selecao") {
            const opcoes = campo.opcoes ?? opcoesApi[campo.chave] ?? [];

            return (
                <View key={campo.chave} style={estilos.grupoEscolha}>
                    <Text style={estilos.rotulo}>{campo.rotulo}</Text>
                    {opcoes.length === 0 ? (
                        <Text style={estilos.suave}>
                            Nenhuma opção disponível. Cadastre antes na aba correspondente.
                        </Text>
                    ) : (
                        <View style={estilos.chips}>
                            {opcoes.map((opcao) => (
                                <Chip
                                    key={opcao.valor}
                                    texto={opcao.rotulo}
                                    selecionado={form[campo.chave] === opcao.valor}
                                    onPress={() => setForm({ ...form, [campo.chave]: opcao.valor })}
                                />
                            ))}
                        </View>
                    )}
                </View>
            );
        }

        return (
            <CampoTexto
                key={campo.chave}
                rotulo={campo.rotulo}
                value={form[campo.chave] ?? ""}
                placeholder={campo.placeholder}
                keyboardType={TECLADO[campo.tipo]}
                autoCapitalize={campo.tipo === "email" ? "none" : "sentences"}
                onChangeText={(texto) =>
                    setForm({ ...form, [campo.chave]: campo.mascara ? campo.mascara(texto) : texto })
                }
            />
        );
    }

    if (carregando) {
        return (
            <View style={estilos.centro}>
                <ActivityIndicator color={cores.destaque} size="large" />
            </View>
        );
    }

    return (
        <View style={estilos.tela}>
            <View style={estilos.barra}>
                <TextInput
                    value={busca}
                    onChangeText={setBusca}
                    placeholder="Buscar..."
                    placeholderTextColor={cores.textoSuave}
                    style={estilos.busca}
                />
                <Botao titulo="+ Novo" onPress={() => abrirFormulario()} estilo={estilos.botaoNovo} />
            </View>

            {erroLista && (
                <View style={estilos.areaErro}>
                    <CaixaDeErro mensagem={erroLista} />
                    <Botao titulo="Tentar novamente" tipo="secundario" onPress={() => void carregar()} />
                </View>
            )}

            <FlatList
                data={itensFiltrados}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={estilos.lista}
                refreshControl={
                    <RefreshControl
                        refreshing={atualizando}
                        tintColor={cores.destaque}
                        onRefresh={() => {
                            setAtualizando(true);
                            void carregar();
                        }}
                    />
                }
                ListEmptyComponent={
                    erroLista ? null : (
                        <Text style={[estilos.suave, estilos.vazio]}>
                            {busca ? "Nada encontrado para a busca." : `Nenhum ${nomeSingular} cadastrado ainda.`}
                        </Text>
                    )
                }
                renderItem={({ item }) => {
                    const visual = mostrar(item);
                    return (
                        <View style={estilos.cartao}>
                            <Text style={estilos.cartaoTitulo}>{visual.titulo}</Text>
                            {visual.linhas.map((linha, indice) => (
                                <Text key={indice} style={estilos.cartaoLinha}>
                                    {linha}
                                </Text>
                            ))}
                            {visual.selo ? <Selo texto={visual.selo} /> : null}

                            <View style={estilos.acoes}>
                                <Botao
                                    titulo="Editar"
                                    tipo="secundario"
                                    onPress={() => abrirFormulario(item)}
                                    estilo={estilos.botaoAcao}
                                />
                                <Botao
                                    titulo="Excluir"
                                    tipo="perigo"
                                    onPress={() => void excluir(item)}
                                    estilo={estilos.botaoAcao}
                                />
                            </View>
                        </View>
                    );
                }}
            />

            <Modal
                visible={formAberto}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setFormAberto(false)}
            >
                <KeyboardAvoidingView
                    style={estilos.modal}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <ScrollView contentContainerStyle={estilos.modalConteudo} keyboardShouldPersistTaps="handled">
                        <Text style={estilos.modalTitulo}>
                            {editandoId === null ? `Novo ${nomeSingular}` : `Editar ${nomeSingular}`}
                        </Text>

                        {erroForm && <CaixaDeErro mensagem={erroForm} />}

                        {campos.map(renderCampo)}

                        <View style={estilos.acoes}>
                            <Botao
                                titulo="Cancelar"
                                tipo="secundario"
                                onPress={() => setFormAberto(false)}
                                estilo={estilos.botaoAcao}
                            />
                            <Botao
                                titulo="Salvar"
                                onPress={() => void salvar()}
                                carregando={salvando}
                                estilo={estilos.botaoAcao}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

const estilos = StyleSheet.create({
    tela: { flex: 1 },
    centro: { flex: 1, alignItems: "center", justifyContent: "center" },
    barra: { flexDirection: "row", alignItems: "center", padding: 12, gap: 10 },
    busca: {
        flex: 1,
        backgroundColor: cores.superficie,
        color: cores.texto,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: cores.borda,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 16,
    },
    botaoNovo: { paddingHorizontal: 16 },
    areaErro: { paddingHorizontal: 12 },
    lista: { padding: 12, paddingTop: 0, paddingBottom: 24 },
    vazio: { textAlign: "center", marginTop: 40 },
    suave: { color: cores.textoSuave, fontSize: 14 },
    cartao: {
        backgroundColor: cores.superficie,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: cores.borda,
        padding: 14,
        marginBottom: 10,
    },
    cartaoTitulo: { color: cores.texto, fontSize: 17, fontWeight: "700", marginBottom: 4 },
    cartaoLinha: { color: cores.textoSuave, fontSize: 14, marginTop: 2 },
    acoes: { flexDirection: "row", gap: 10, marginTop: 14 },
    botaoAcao: { flex: 1, paddingVertical: 10 },
    modal: { flex: 1, backgroundColor: cores.fundo },
    modalConteudo: { padding: 20, paddingTop: 56, paddingBottom: 40 },
    modalTitulo: { color: cores.texto, fontSize: 22, fontWeight: "700", marginBottom: 18 },
    grupoEscolha: { marginBottom: 10 },
    rotulo: { color: cores.textoSuave, fontSize: 13, marginBottom: 8 },
    chips: { flexDirection: "row", flexWrap: "wrap" },
});
