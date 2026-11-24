import { Router } from "express";
import { login, perfil, registrar } from "../controllers/auth-controller";
import { autenticar } from "../middlewares/autenticar";
import { validar } from "../middlewares/validar";
import { loginSchema, registrarSchema } from "../schemas/auth-schema";

const authRoutes = Router();

/**
 * @openapi
 * /auth/registrar:
 *   post:
 *     summary: Cria uma conta de usuário
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistrarInput'
 *     responses:
 *       201:
 *         description: Usuário criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: E-mail já cadastrado
 */
authRoutes.post("/registrar", validar(registrarSchema, "body"), registrar);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Faz login e devolve o token JWT
 *     description: Copie o token da resposta, clique em "Authorize" (cadeado no topo da página) e cole para liberar as demais rotas.
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login realizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResposta'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: E-mail ou senha inválidos
 */
authRoutes.post("/login", validar(loginSchema, "body"), login);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Dados do usuário logado
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Usuário logado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         $ref: '#/components/responses/NaoAutorizado'
 */
authRoutes.get("/me", autenticar, perfil);

export { authRoutes };
