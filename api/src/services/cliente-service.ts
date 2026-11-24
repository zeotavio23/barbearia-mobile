import { AppError } from "../errors/app-error";
import { ClienteRepository } from "../repositories/cliente-repository";
import { ClienteInput } from "../schemas/cliente-schema";

export class ClienteService {
    constructor(private readonly repository: ClienteRepository) {}

    listar(nome?: string) {
        return this.repository.listar(nome);
    }

    async buscarPorId(id: number) {
        const cliente = await this.repository.buscarPorId(id);
        if (!cliente) throw new AppError("Cliente não encontrado", 404);
        return cliente;
    }

    async criar(dados: ClienteInput) {
        if (await this.repository.buscarPorTelefone(dados.telefone)) {
            throw new AppError("Telefone já cadastrado", 409);
        }
        return this.repository.criar(dados);
    }

    async atualizar(id: number, dados: ClienteInput) {
        await this.buscarPorId(id);

        const mesmoTelefone = await this.repository.buscarPorTelefone(dados.telefone);
        if (mesmoTelefone && mesmoTelefone.id !== id) {
            throw new AppError("Telefone pertence a outro cliente", 409);
        }
        return this.repository.atualizar(id, dados);
    }

    async excluir(id: number) {
        await this.buscarPorId(id);

        if ((await this.repository.contarAgendamentos(id)) > 0) {
            throw new AppError("Não é possível excluir: o cliente possui agendamentos", 409);
        }
        await this.repository.excluir(id);
    }
}
