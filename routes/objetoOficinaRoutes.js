import express from 'express';
import { objetoOficinaController } from '../controllers/objetoOficinaController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Ruta para actualizar o insertar un objeto de oficina
router.post('/upsert', objetoOficinaController.upsertObjetoOficina);

// Ruta para obtener los objetos habilitados del usuario
router.get('/habilitados', objetoOficinaController.getObjetosHabilitados);

export default router;