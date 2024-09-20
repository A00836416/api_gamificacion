import express from 'express';
import * as progresoTareaController from '../controllers/progresoTareaController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authMiddleware, progresoTareaController.crearProgresoTarea);
router.get('/:empleadoID', authMiddleware, progresoTareaController.obtenerProgresoTareas);

export default router;