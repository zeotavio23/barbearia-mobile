import { Router } from "express";
import {
    atualizarAgendamento,
    buscarAgendamentoPorId,
    criarAgendamento,
    excluirAgendamento,
    listarAgendamentos,
} from "../controllers/agendamentos-controller";
import { validar } from "../middlewares/validar";
import { agendamentoInputSchema } from "../schemas/agendamento-schema";
import { idSchema } from "../schemas/id-schema";

const agendamentosRoutes = Router();

/**
 * @openapi
 * /agendamentos:
 *   get:
 *     summary: Lista os agendamentos (com cliente, barbeiro e serviço)
 *     tags: [Agendamentos]
 *     responses:
 *       200:
 *         description: Lista de agendamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agendamento'
 *       401:
 *         $ref: '#/components/responses/NaoAutorizado'
 */
agendamentosRoutes.get("/", listarAgendamentos);

/**
 * @openapi
 * /agendamentos/{id}:
 *   get:
 *     summary: Busca um agendamento pelo ID
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Agendamento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agendamento'
 *       400:
 *         description: ID inválido
 *       401:
 *         $ref: '#/components/responses/NaoAutorizado'
 *       404:
 *         description: Agendamento não encontrado
 */
agendamentosRoutes.get("/:id", validar(idSchema, "params"), buscarAgendamentoPorId);

/**
 * @openapi
 * /agendamentos:
 *   post:
 *     summary: Cria um agendamento
 *     tags: [Agendamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgendamentoInput'
 *     responses:
 *       201:
 *         description: Agendamento criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agendamento'
 *       400:
 *         description: Dados inválidos ou data/hora no passado
 *       401:
 *         $ref: '#/components/responses/NaoAutorizado'
 *       404:
 *         description: Cliente, barbeiro ou serviço informado não existe
 *       409:
 *         description: Barbeiro já possui agendamento nesse horário
 */
agendamentosRoutes.post("/", validar(agendamentoInputSchema, "body"), criarAgendamento);

/**
 * @openapi
 * /agendamentos/{id}:
 *   put:
 *     summary: Atualiza um agendamento
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AgendamentoInput'
 *     responses:
 *       200:
 *         description: Agendamento atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agendamento'
 *       400:
 *         description: Dados ou ID inválidos
 *       401:
 *         $ref: '#/components/responses/NaoAutorizado'
 *       404:
 *         description: Agendamento, cliente, barbeiro ou serviço não encontrado
 *       409:
 *         description: Barbeiro já possui agendamento nesse horário
 */
agendamentosRoutes.put(
    "/:id",
    validar(idSchema, "params"),
    validar(agendamentoInputSchema, "body"),
    atualizarAgendamento
);

/**
 * @openapi
 * /agendamentos/{id}:
 *   delete:
 *     summary: Exclui um agendamento
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Agendamento excluído
 *       400:
 *         description: ID inválido
 *       401:
 *         $ref: '#/components/responses/NaoAutorizado'
 *       404:
 *         description: Agendamento não encontrado
 */
agendamentosRoutes.delete("/:id", validar(idSchema, "params"), excluirAgendamento);

export { agendamentosRoutes };
