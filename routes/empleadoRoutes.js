import express from 'express';
import * as empleadoController from '../controllers/empleadoController.js';
import { authMiddleware, isAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.put('/completar-perfil/:usuarioID', authMiddleware, isAdmin, empleadoController.completarPerfilEmpleado);
router.post('/crear-usuario-empleado', authMiddleware, isAdmin, empleadoController.crearUsuarioYEmpleado);
router.post('/asignar-departamento', authMiddleware, isAdmin, empleadoController.asignarEmpleadoADepartamento);
router.get('/', authMiddleware, empleadoController.obtenerEmpleados);
router.get('/departamento/:departamentoID', authMiddleware, empleadoController.obtenerEmpleadosPorDepartamento);
router.put('/actualizar-posicion', authMiddleware, isAdmin, empleadoController.actualizarPosicionEmpleado);


export default router;


