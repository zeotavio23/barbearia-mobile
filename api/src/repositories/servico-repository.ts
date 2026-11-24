import { Servico } from "../models/servico";
import { ServicoInput } from "../schemas/servico-schema";

export interface ServicoRepository {
    listar(nome?: string): Promise<Servico[]>;
    buscarPorId(id: number): Promise<Servico | null>;
    buscarPorNome(nome: string): Promise<Servico | null>;
    criar(dados: ServicoInput): Promise<Servico>;
    atualizar(id: number, dados: ServicoInput): Promise<Servico>;
    excluir(id: number): Promise<void>;
    contarAgendamentos(id: number): Promise<number>;
}
