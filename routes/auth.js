import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { getUser, updateUserInfo } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/user', authMiddleware, getUser);
router.put('/user', authMiddleware, updateUserInfo);

export default router;