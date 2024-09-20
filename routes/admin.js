import express from 'express';
import { getTaskProgress, verifyTask } from '../controllers/adminController.js';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Aplicar middleware de autenticación y verificación de rol de administrador a todas las rutas
router.use(authMiddleware, isAdmin);

// Ruta para obtener el progreso de las tareas
router.get('/task-progress', getTaskProgress);

// Ruta para verificar una tarea
router.post('/verify-task/:progresoID', verifyTask);

export default router;