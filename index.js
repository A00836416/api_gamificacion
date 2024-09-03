import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import { authMiddleware, isAdmin } from './middlewares/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

await connectDB();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:3000', // Asegúrate de que esta URL coincida con la del frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Habilita el envío de cookies y encabezados de autorización
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
  }
}));

app.use('/auth', authRoutes);

app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Esta es una ruta protegida', userId: req.user.id, rol: req.user.rol });
});

app.get('/admin', authMiddleware, isAdmin, (req, res) => {
  res.json({ message: 'Esta es una ruta solo para administradores' });
});

app.get('/auth/check-auth', authMiddleware, (req, res) => {
  res.json({ isAuthenticated: true, user: req.user });
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));