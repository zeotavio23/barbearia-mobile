import { AppError } from "../errors/app-error";
import { ServicoRepository } from "../repositories/servico-repository";
import { ServicoInput } from "../schemas/servico-schema";

export class ServicoService {
    constructor(private readonly repository: ServicoRepository) {}

    listar(nome?: string) {
        return this.repository.listar(nome);
    }

    async buscarPorId(id: number) {
        const servico = await this.repository.buscarPorId(id);
        if (!servico) throw new AppError("Serviço não encontrado", 404);
        return servico;
    }

    async criar(dados: ServicoInput) {
        if (await this.repository.buscarPorNome(dados.nome)) {
            throw new AppError("Já existe um serviço com esse nome", 409);
        }
        return this.repository.criar(dados);
    }

    async atualizar(id: number, dados: ServicoInput) {
        await this.buscarPorId(id);

        const mesmoNome = await this.repository.buscarPorNome(dados.nome);
        if (mesmoNome && mesmoNome.id !== id) {
            throw new AppError("Já existe outro serviço com esse nome", 409);
        }
        return this.repository.atualizar(id, dados);
    }

    async excluir(id: number) {
        await this.buscarPorId(id);

        if ((await this.repository.contarAgendamentos(id)) > 0) {
            throw new AppError("Não é possível excluir: o serviço possui agendamentos", 409);
        }
        await this.repository.excluir(id);
    }
}
