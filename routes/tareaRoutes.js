// routes/tareaRoutes.js
import express from 'express';
import * as tareaController from '../controllers/tareaController.js';
import { authMiddleware } from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

// Rutas específicas primero
router.put('/completar', authMiddleware, tareaController.completarTarea);
router.post('/iniciar', authMiddleware, tareaController.iniciarTarea);
router.post('/verificar', authMiddleware, isAdmin, tareaController.verificarTarea);
router.get('/empleado', authMiddleware, tareaController.obtenerTareasEmpleado);

// Rutas con parámetros después
router.get('/:id', authMiddleware, tareaController.obtenerTarea);
router.put('/:id', authMiddleware, tareaController.actualizarTarea);
router.delete('/:id', authMiddleware, isAdmin, tareaController.eliminarTarea);

// Rutas generales al final
router.get('/', authMiddleware, tareaController.obtenerTareas);
router.post('/', authMiddleware, isAdmin, tareaController.crearTarea);

export default router;