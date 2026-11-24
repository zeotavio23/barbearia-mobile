import { Barbeiro } from "../models/barbeiro";
import { BarbeiroInput } from "../schemas/barbeiro-schema";

export interface BarbeiroRepository {
    listar(nome?: string): Promise<Barbeiro[]>;
    buscarPorId(id: number): Promise<Barbeiro | null>;
    criar(dados: BarbeiroInput): Promise<Barbeiro>;
    atualizar(id: number, dados: BarbeiroInput): Promise<Barbeiro>;
    excluir(id: number): Promise<void>;
    contarAgendamentos(id: number): Promise<number>;
}
