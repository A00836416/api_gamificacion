import express from 'express';
import * as departamentoController from '../controllers/departamentoController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

router.post('/', isAdmin, departamentoController.crearDepartamento);
router.get('/', departamentoController.obtenerDepartamentos);
router.get('/:id', departamentoController.obtenerDepartamento);
router.put('/:id', isAdmin, departamentoController.actualizarDepartamento);
router.delete('/:id', isAdmin, departamentoController.eliminarDepartamento);

export default router;

