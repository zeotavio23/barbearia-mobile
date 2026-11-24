import { AppError } from "../errors/app-error";
import { AgendamentoRepository } from "../repositories/agendamento-repository";
import { BarbeiroRepository } from "../repositories/barbeiro-repository";
import { ClienteRepository } from "../repositories/cliente-repository";
import { ServicoRepository } from "../repositories/servico-repository";
import { AgendamentoInput } from "../schemas/agendamento-schema";

const MINUTO_MS = 60 * 1000;

export class AgendamentoService {
    constructor(
        private readonly repository: AgendamentoRepository,
        private readonly clienteRepository: ClienteRepository,
        private readonly barbeiroRepository: BarbeiroRepository,
        private readonly servicoRepository: ServicoRepository
    ) {}

    listar() {
        return this.repository.listar();
    }

    async buscarPorId(id: number) {
        const agendamento = await this.repository.buscarPorId(id);
        if (!agendamento) throw new AppError("Agendamento não encontrado", 404);
        return agendamento;
    }

    // Confere se cliente, barbeiro e serviço existem (a "relação" entre os CRUDs).
    // Devolve o serviço, porque a duração dele é usada para checar conflito de horário.
    private async validarReferencias(dados: AgendamentoInput) {
        if (!(await this.clienteRepository.buscarPorId(dados.clienteId))) {
            throw new AppError("Cliente informado não existe", 404);
        }
        if (!(await this.barbeiroRepository.buscarPorId(dados.barbeiroId))) {
            throw new AppError("Barbeiro informado não existe", 404);
        }
        const servico = await this.servicoRepository.buscarPorId(dados.servicoId);
        if (!servico) {
            throw new AppError("Serviço informado não existe", 404);
        }
        return servico;
    }

    // O barbeiro não pode ter dois agendamentos ativos que se sobreponham no tempo.
    // Ex: corte de 30min às 14:00 ocupa 14:00-14:30, então 14:15 já conflita.
    private async validarConflito(
        dados: AgendamentoInput,
        inicio: Date,
        duracaoMinutos: number,
        ignorarId?: number
    ) {
        if (dados.status === "cancelado") return; // cancelado não ocupa horário

        const fim = new Date(inicio.getTime() + duracaoMinutos * MINUTO_MS);
        const conflito = await this.repository.buscarConflito(
            dados.barbeiroId,
            inicio,
            fim,
            ignorarId
        );

        if (conflito) {
            throw new AppError("Este barbeiro já possui um agendamento nesse horário", 409);
        }
    }

    async criar(dados: AgendamentoInput) {
        const servico = await this.validarReferencias(dados);

        const inicio = new Date(dados.dataHora);
        if (Number.isNaN(inicio.getTime())) {
            throw new AppError("Data/hora inválida", 400);
        }
        if (inicio.getTime() <= Date.now()) {
            throw new AppError("A data/hora do agendamento deve ser no futuro", 400);
        }

        await this.validarConflito(dados, inicio, servico.duracaoMinutos);

        return this.repository.criar({ ...dados, dataHora: inicio });
    }

    async atualizar(id: number, dados: AgendamentoInput) {
        const atual = await this.buscarPorId(id);
        const servico = await this.validarReferencias(dados);

        const inicio = new Date(dados.dataHora);
        if (Number.isNaN(inicio.getTime())) {
            throw new AppError("Data/hora inválida", 400);
        }

        // "No futuro" só vale ao marcar/remarcar. Assim dá para marcar como
        // "concluido" um atendimento que já aconteceu, sem mexer no horário.
        const mudouHorario = inicio.getTime() !== new Date(atual.dataHora).getTime();
        const aindaAtivo = dados.status === "agendado" || dados.status === "confirmado";
        if (mudouHorario && aindaAtivo && inicio.getTime() <= Date.now()) {
            throw new AppError("A data/hora do agendamento deve ser no futuro", 400);
        }

        await this.validarConflito(dados, inicio, servico.duracaoMinutos, id);

        return this.repository.atualizar(id, { ...dados, dataHora: inicio });
    }

    async excluir(id: number) {
        await this.buscarPorId(id);
        await this.repository.excluir(id);
    }
}
