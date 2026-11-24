import { AppError } from "../errors/app-error";
import { BarbeiroRepository } from "../repositories/barbeiro-repository";
import { BarbeiroInput } from "../schemas/barbeiro-schema";

export class BarbeiroService {
    constructor(private readonly repository: BarbeiroRepository) {}

    listar(nome?: string) {
        return this.repository.listar(nome);
    }

    async buscarPorId(id: number) {
        const barbeiro = await this.repository.buscarPorId(id);
        if (!barbeiro) throw new AppError("Barbeiro não encontrado", 404);
        return barbeiro;
    }

    criar(dados: BarbeiroInput) {
        return this.repository.criar(dados);
    }

    async atualizar(id: number, dados: BarbeiroInput) {
        await this.buscarPorId(id);
        return this.repository.atualizar(id, dados);
    }

    async excluir(id: number) {
        await this.buscarPorId(id);

        if ((await this.repository.contarAgendamentos(id)) > 0) {
            throw new AppError("Não é possível excluir: o barbeiro possui agendamentos", 409);
        }
        await this.repository.excluir(id);
    }
}
