import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { authMiddleware, isAdmin } from '../middlewares/auth.js';

const router = express.Router();


router.get('/', authMiddleware, notificationController.obtenerNotificacionesPorUsuario);


export default router;
