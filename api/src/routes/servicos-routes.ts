import { Router } from "express";
import {
    atualizarServico,
    buscarServicoPorId,
    criarServico,
    excluirServico,
    listarServicos,
} from "../controllers/servicos-controller";
import { validar } from "../middlewares/validar";
import { idSchema } from "../schemas/id-schema";
import { servicoInputSchema } from "../schemas/servico-schema";

const servicosRoutes = Router();

/**
 * @openapi
 * /servicos:
 *   get:
 *     summary: Lista os serviços
 *     tags: [Serviços]
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtra os serviços pelo nome
 *     responses:
 *       200:
 *         description: Lista de serviços
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Servico'
 *       401:
 *         $ref: '#/components/responses/NaoAutorizado'
 */
servicosRoutes.get("/", listarServicos);

/**
 * @openapi
 * /servicos/{id}:
 *   get:
 *     summary: Busca um serviço pelo ID
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Serviço encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servico'
 *       400:
 *         description: ID inválido
 *       401:
 *         $ref: '#/components/responses/NaoAutorizado'
 *       404:
 *         description: Serviço não encontrado
 */
servicosRoutes.get("/:id", validar(idSchema, "params"), buscarServicoPorId);

/**
 * @openapi
 * /servicos:
 *   post:
 *     summary: Cadastra um serviço
 *     tags: [Serviços]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServicoInput'
 *     responses:
 *       201:
 *         description: Serviço cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servico'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         $ref: '#/components/responses/NaoAutorizado'
 *       409:
 *         description: Já existe um serviço com esse nome
 */
servicosRoutes.post("/", validar(servicoInputSchema, "body"), criarServico);

/**
 * @openapi
 * /servicos/{id}:
 *   put:
 *     summary: Atualiza um serviço
 *     tags: [Serviços]
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
 *             $ref: '#/components/schemas/ServicoInput'
 *     responses:
 *       200:
 *         description: Serviço atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Servico'
 *       400:
 *         description: Dados ou ID inválidos
 *       401:
 *         $ref: '#/components/responses/NaoAutorizado'
 *       404:
 *         description: Serviço não encontrado
 *       409:
 *         description: Já existe outro serviço com esse nome
 */
servicosRoutes.put(
    "/:id",
    validar(idSchema, "params"),
    validar(servicoInputSchema, "body"),
    atualizarServico
);

/**
 * @openapi
 * /servicos/{id}:
 *   delete:
 *     summary: Exclui um serviço
 *     tags: [Serviços]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Serviço excluído
 *       400:
 *         description: ID inválido
 *       401:
 *         $ref: '#/components/responses/NaoAutorizado'
 *       404:
 *         description: Serviço não encontrado
 *       409:
 *         description: Serviço possui agendamentos
 */
servicosRoutes.delete("/:id", validar(idSchema, "params"), excluirServico);

export { servicosRoutes };
