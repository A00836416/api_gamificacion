import express from 'express';
import * as tareaRutaController from '../controllers/tareaRutaController.js';
import { authMiddleware, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authMiddleware, isAdmin, tareaRutaController.asignarTareaARuta);
router.get('/:departamentoID', authMiddleware, tareaRutaController.obtenerTareasDeRuta);

export default router;