import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import departamentoRoutes from './routes/departamentoRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';
import { authMiddleware, isAdmin } from './middlewares/auth.js';
import tareaRutaRoutes from './routes/tareaRutaRoutes.js';
import empleadoRoutes from './routes/empleadoRoutes.js';
import progresoTareaRoutes from './routes/progresoTareaRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas protegidas
app.use('/api/departamentos', authMiddleware, departamentoRoutes);
app.use('/api/tareas', authMiddleware, tareaRoutes);
app.use('/api/tarea-ruta', tareaRutaRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/progreso-tarea', progresoTareaRoutes);

app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Esta es una ruta protegida', userId: req.user.id, rol: req.user.rol });
});

app.get('/admin', authMiddleware, isAdmin, (req, res) => {
  res.json({ message: 'Esta es una ruta solo para administradores' });
});

app.get('/auth/check-auth', authMiddleware, (req, res) => {
  res.json({ isAuthenticated: true, user: req.user });
});

// Configuración para servir el juego de Unity
const unityPath = path.join(__dirname, 'public/unity');
if (fs.existsSync(unityPath)) {
  // Servir los archivos estáticos de Unity solo si la carpeta existe
  app.use('/unity', express.static(unityPath));

  // Ruta para el juego de Unity
  app.get('/game', (req, res) => {
    res.sendFile(path.join(unityPath, 'index.html'));
  });
  console.log('Juego de Unity disponible en /game');
} else {
  console.log('La carpeta de Unity no está presente en este servidor.');
}

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));