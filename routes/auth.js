import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { getUser } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/user', authMiddleware, getUser);

export default router;