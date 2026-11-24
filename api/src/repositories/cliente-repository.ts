import { Cliente } from "../models/cliente";
import { ClienteInput } from "../schemas/cliente-schema";

export interface ClienteRepository {
    listar(nome?: string): Promise<Cliente[]>;
    buscarPorId(id: number): Promise<Cliente | null>;
    buscarPorTelefone(telefone: string): Promise<Cliente | null>;
    criar(dados: ClienteInput): Promise<Cliente>;
    atualizar(id: number, dados: ClienteInput): Promise<Cliente>;
    excluir(id: number): Promise<void>;
    contarAgendamentos(id: number): Promise<number>;
}
