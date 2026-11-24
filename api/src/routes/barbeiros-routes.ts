import { Router } from "express";
import {
    atualizarBarbeiro,
    buscarBarbeiroPorId,
    criarBarbeiro,
    excluirBarbeiro,
    listarBarbeiros,
} from "../controllers/barbeiros-controller";
import { validar } from "../middlewares/validar";
import { barbeiroInputSchema } from "../schemas/barbeiro-schema";
import { idSchema } from "../schemas/id-schema";

const barbeirosRoutes = Router();

/**
 * @openapi
 * /barbeiros:
 *   get:
 *     summary: Lista os barbeiros
 *     tags: [Barbeiros]
 *     parameters:
 *       - in: query
 *         name: nome
 *         required: false
 *         schema:
 *           type: string
 *         description: Filtra os barbeiros pelo nome
 *     responses:
 *       200:
 *         description: Lista de barbeiros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Barbeiro'
 *       401:
 *         $ref: '#/components/responses/NaoAutorizado'
 */
barbeirosRoutes.get("/", listarBarbeiros);

/**
 * @openapi
 * /barbeiros/{id}:
 *   get:
 *     summary: Busca um barbeiro pelo ID
 *     tags: [Barbeiros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Barbeiro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Barbeiro'
 *       400:
 *         description: ID inválido
 *       401:
 *         $ref: '#/components/responses/NaoAutorizado'
 *       404:
 *         description: Barbeiro não encontrado
 */
barbeirosRoutes.get("/:id", validar(idSchema, "params"), buscarBarbeiroPorId);

/**
 * @openapi
 * /barbeiros:
 *   post:
 *     summary: Cadastra um barbeiro
 *     tags: [Barbeiros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BarbeiroInput'
 *     responses:
 *       201:
 *         description: Barbeiro cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Barbeiro'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         $ref: '#/components/responses/NaoAutorizado'
 */
barbeirosRoutes.post("/", validar(barbeiroInputSchema, "body"), criarBarbeiro);

/**
 * @openapi
 * /barbeiros/{id}:
 *   put:
 *     summary: Atualiza um barbeiro
 *     tags: [Barbeiros]
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
 *             $ref: '#/components/schemas/BarbeiroInput'
 *     responses:
 *       200:
 *         description: Barbeiro atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Barbeiro'
 *       400:
 *         description: Dados ou ID inválidos
 *       401:
 *         $ref: '#/components/responses/NaoAutorizado'
 *       404:
 *         description: Barbeiro não encontrado
 */
barbeirosRoutes.put(
    "/:id",
    validar(idSchema, "params"),
    validar(barbeiroInputSchema, "body"),
    atualizarBarbeiro
);

/**
 * @openapi
 * /barbeiros/{id}:
 *   delete:
 *     summary: Exclui um barbeiro
 *     tags: [Barbeiros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Barbeiro excluído
 *       400:
 *         description: ID inválido
 *       401:
 *         $ref: '#/components/responses/NaoAutorizado'
 *       404:
 *         description: Barbeiro não encontrado
 *       409:
 *         description: Barbeiro possui agendamentos
 */
barbeirosRoutes.delete("/:id", validar(idSchema, "params"), excluirBarbeiro);

export { barbeirosRoutes };
