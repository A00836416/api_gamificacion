import express from 'express';
import { register, login, logout, changePassword } from '../controllers/authController.js';
import { getUser, updateUserInfo } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/user', authMiddleware, getUser);
router.put('/user', authMiddleware, updateUserInfo);
router.put('/change-password', authMiddleware, changePassword);


export default router;