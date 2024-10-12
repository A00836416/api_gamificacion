// routes/tareaRoutes.js
import express from 'express';
import * as tareaController from '../controllers/tareaController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

router.post('/', authMiddleware, isAdmin, tareaController.crearTarea);
router.get('/', authMiddleware, tareaController.obtenerTareas);
router.get('/empleado', authMiddleware, tareaController.obtenerTareasEmpleado);
router.get('/:id', authMiddleware, tareaController.obtenerTarea);
router.put('/:id', authMiddleware, isAdmin, tareaController.actualizarTarea);
router.delete('/:id', authMiddleware, isAdmin, tareaController.eliminarTarea);
router.post('/iniciar', authMiddleware, tareaController.iniciarTarea);
router.put('/completar', authMiddleware, tareaController.completarTarea);
router.put('/verificar', authMiddleware, isAdmin, tareaController.verificarTarea);

export default router;