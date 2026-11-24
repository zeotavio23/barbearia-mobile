import { AgendamentoRepositoryPrisma } from "./repositories/agendamento-repository-prisma";
import { BarbeiroRepositoryPrisma } from "./repositories/barbeiro-repository-prisma";
import { ClienteRepositoryPrisma } from "./repositories/cliente-repository-prisma";
import { ServicoRepositoryPrisma } from "./repositories/servico-repository-prisma";
import { UsuarioRepositoryPrisma } from "./repositories/usuario-repository-prisma";

import { AgendamentoService } from "./services/agendamento-service";
import { AuthService } from "./services/auth-service";
import { BarbeiroService } from "./services/barbeiro-service";
import { ClienteService } from "./services/cliente-service";
import { ServicoService } from "./services/servico-service";

// Aqui tudo se conecta: Repository -> Service. Os controllers só importam os services.
const clienteRepository = new ClienteRepositoryPrisma();
const barbeiroRepository = new BarbeiroRepositoryPrisma();
const servicoRepository = new ServicoRepositoryPrisma();
const agendamentoRepository = new AgendamentoRepositoryPrisma();
const usuarioRepository = new UsuarioRepositoryPrisma();

export const clienteService = new ClienteService(clienteRepository);
export const barbeiroService = new BarbeiroService(barbeiroRepository);
export const servicoService = new ServicoService(servicoRepository);
export const authService = new AuthService(usuarioRepository);
export const agendamentoService = new AgendamentoService(
    agendamentoRepository,
    clienteRepository,
    barbeiroRepository,
    servicoRepository
);
