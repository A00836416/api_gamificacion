import express from 'express';
import { obtenerRankingSemanal } from '../controllers/rankingController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', authMiddleware, obtenerRankingSemanal);

export default router;