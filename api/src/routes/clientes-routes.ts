import { Router } from "express";
import {
    atualizarCliente,
    buscarClientePorId,
    criarCliente,
    excluirCliente,
    listarClientes,
} from "../controllers/clientes-controller";
import { validar } from "../middlewares/validar";
import { clienteInputSchema } from "../schemas/cliente-schema";
import { idSchema } from "../schemas/id-schema";

const clientesRoutes = Router();

/**
 * @openapi
 * /clientes:
 *   get:
 *     summary: Lista os clientes
 *     tags: [Clientes]
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtra os clientes pelo nome
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 *       401:
 *         $ref: '#/components/responses/NaoAutorizado'
 */
clientesRoutes.get("/", listarClientes);

/**
 * @openapi
 * /clientes/{id}:
 *   get:
 *     summary: Busca um cliente pelo ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: ID inválido
 *       401:
 *         $ref: '#/components/responses/NaoAutorizado'
 *       404:
 *         description: Cliente não encontrado
 */
clientesRoutes.get("/:id", validar(idSchema, "params"), buscarClientePorId);

/**
 * @openapi
 * /clientes:
 *   post:
 *     summary: Cadastra um cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClienteInput'
 *     responses:
 *       201:
 *         description: Cliente cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         $ref: '#/components/responses/NaoAutorizado'
 *       409:
 *         description: Telefone já cadastrado
 */
clientesRoutes.post("/", validar(clienteInputSchema, "body"), criarCliente);

/**
 * @openapi
 * /clientes/{id}:
 *   put:
 *     summary: Atualiza um cliente
 *     tags: [Clientes]
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
 *             $ref: '#/components/schemas/ClienteInput'
 *     responses:
 *       200:
 *         description: Cliente atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Dados ou ID inválidos
 *       401:
 *         $ref: '#/components/responses/NaoAutorizado'
 *       404:
 *         description: Cliente não encontrado
 *       409:
 *         description: Telefone pertence a outro cliente
 */
clientesRoutes.put(
    "/:id",
    validar(idSchema, "params"),
    validar(clienteInputSchema, "body"),
    atualizarCliente
);

/**
 * @openapi
 * /clientes/{id}:
 *   delete:
 *     summary: Exclui um cliente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Cliente excluído
 *       400:
 *         description: ID inválido
 *       401:
 *         $ref: '#/components/responses/NaoAutorizado'
 *       404:
 *         description: Cliente não encontrado
 *       409:
 *         description: Cliente possui agendamentos
 */
clientesRoutes.delete("/:id", validar(idSchema, "params"), excluirCliente);

export { clientesRoutes };
