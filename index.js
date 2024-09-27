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

// Middleware para logging de solicitudes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware mejorado para manejar archivos Brotli
app.use((req, res, next) => {
  if (req.url.includes('/unity/') && req.url.endsWith('.wasm.br')) {
    const filePath = path.join(__dirname, 'public', req.url);
    if (fs.existsSync(filePath)) {
      res.set('Content-Type', 'application/wasm');
      res.set('Content-Encoding', 'br');
      fs.createReadStream(filePath).pipe(res);
    } else {
      console.log(`Archivo .wasm.br no encontrado: ${req.url}`);
      next();
    }
  } else {
    next();
  }
});
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

const unityPath = path.join(__dirname, 'public/unity');
console.log('Buscando Unity en:', unityPath);
if (fs.existsSync(unityPath)) {
  console.log('Carpeta Unity encontrada');
  app.use('/unity', express.static(unityPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.br')) {
        res.set('Content-Encoding', 'br');
        res.set('Content-Type', 'application/javascript');
      }
    }
  }));
  app.get('/game', (req, res) => {
    const gamePath = path.join(unityPath, 'index.html');
    console.log('Intentando servir el juego desde:', gamePath);
    if (fs.existsSync(gamePath)) {
      res.sendFile(gamePath);
    } else {
      console.log('Archivo index.html no encontrado en:', gamePath);
      res.status(404).send('Juego no encontrado');
    }
  });
  console.log('Juego de Unity disponible en /game');
} else {
  console.log('La carpeta de Unity no está presente en este servidor.');
}

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));