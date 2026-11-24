import { gerarHash } from "../lib/senha";
import { prisma } from "../lib/prisma";

// Popula o banco com dados de exemplo. Pode rodar mais de uma vez:
// só cria o que ainda não existe.
//   npm run db:seed
async function main() {
    await prisma.usuario.upsert({
        where: { email: "admin@barbearia.com" },
        update: {},
        create: {
            nome: "Administrador",
            email: "admin@barbearia.com",
            senhaHash: await gerarHash("123456"),
        },
    });

    if ((await prisma.barbeiro.count()) === 0) {
        await prisma.barbeiro.createMany({
            data: [
                { nome: "Rafael Lima", especialidade: "Corte e Barba", telefone: "24999991001" },
                { nome: "Bruno Alves", especialidade: "Barba", telefone: "24999991002" },
                { nome: "Diego Martins", especialidade: "Corte Degradê", telefone: "24999991003" },
            ],
        });
    }

    if ((await prisma.servico.count()) === 0) {
        await prisma.servico.createMany({
            data: [
                { nome: "Corte de cabelo", preco: 40, duracaoMinutos: 30 },
                { nome: "Barba", preco: 30, duracaoMinutos: 30 },
                { nome: "Corte + Barba", preco: 65, duracaoMinutos: 60 },
                { nome: "Sobrancelha", preco: 15, duracaoMinutos: 15 },
            ],
        });
    }

    if ((await prisma.cliente.count()) === 0) {
        await prisma.cliente.createMany({
            data: [
                { nome: "João Pereira", telefone: "24999990001", email: "joao.pereira@email.com" },
                { nome: "Marcos Andrade", telefone: "24999990002", email: "marcos.andrade@email.com" },
                { nome: "Lucas Ferreira", telefone: "24999990003", email: "lucas.ferreira@email.com" },
            ],
        });
    }

    if ((await prisma.agendamento.count()) === 0) {
        const cliente = await prisma.cliente.findFirstOrThrow({ orderBy: { id: "asc" } });
        const barbeiro = await prisma.barbeiro.findFirstOrThrow({ orderBy: { id: "asc" } });
        const servico = await prisma.servico.findFirstOrThrow({ orderBy: { id: "asc" } });

        // Amanhã às 14:00
        const amanha = new Date();
        amanha.setDate(amanha.getDate() + 1);
        amanha.setHours(14, 0, 0, 0);

        await prisma.agendamento.create({
            data: {
                clienteId: cliente.id,
                barbeiroId: barbeiro.id,
                servicoId: servico.id,
                dataHora: amanha,
                status: "agendado",
            },
        });
    }

    console.log("Banco populado! Login de teste: admin@barbearia.com / 123456");
}

main()
    .catch((erro) => {
        console.error(erro);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
