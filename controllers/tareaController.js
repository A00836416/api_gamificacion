
import * as tareaService from '../services/tareaService.js';

export async function crearTarea(req, res) {
    try {
        const { empleadosIDs, ...tarea } = req.body;
        console.log('Datos recibidos en el controlador:', { tarea, empleadosIDs });

        const tareaId = await tareaService.crearTarea(tarea, empleadosIDs);
        console.log('Tarea creada con ID:', tareaId);

        res.status(201).json({ id: tareaId, message: 'Tarea creada exitosamente' });
    } catch (error) {
        console.error('Error en el controlador al crear la tarea:', error);
        res.status(500).json({ error: 'Error al crear la tarea', details: error.message });
    }
}


export async function obtenerTareas(req, res) {
    try {
        const tareas = await tareaService.obtenerTareas();
        res.json(tareas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
}

export async function obtenerTarea(req, res) {
    try {
        const tarea = await tareaService.obtenerTareaPorId(req.params.id);
        if (tarea) {
            res.json(tarea);
        } else {
            res.status(404).json({ error: 'Tarea no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la tarea' });
    }
}

export async function obtenerTareasEmpleado(req, res) {
    try {

        const usuarioID = req.user.id;

        const tareas = await tareaService.obtenerTareasEmpleado(usuarioID);

        if (tareas.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron tareas para este usuario' });
        }

        res.json(tareas);
    } catch (error) {
        console.error('Error en el controlador al obtener tareas del empleado:', error);
        res.status(500).json({ error: 'Error al obtener las tareas del empleado' });
    }
}

export async function actualizarTarea(req, res) {
    try {
        await tareaService.actualizarTarea(req.params.id, req.body);
        res.json({ message: 'Tarea actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
}

export async function eliminarTarea(req, res) {
    try {
        await tareaService.eliminarTarea(req.params.id);
        res.json({ message: 'Tarea eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
}

export async function iniciarTarea(req, res) {
    try {
        const empleadoID = req.user.id; // Obtenemos el ID del empleado del token
        const { tareaID } = req.body;
        console.log('oeee');
        await tareaService.iniciarTarea(empleadoID, tareaID);
        res.status(200).json({ message: 'Tarea iniciada exitosamente' });
    } catch (error) {
        console.error('Error al iniciar la tarea:', error);
        res.status(500).json({ error: 'Error al iniciar la tarea', details: error.message });
    }
}

export async function completarTarea(req, res) {
    try {
        const empleadoID = req.user.id; // Obtenemos el ID del empleado del token
        const { tareaID } = req.body;
        await tareaService.completarTarea(empleadoID, tareaID);
        res.status(200).json({ message: 'Tarea completada exitosamente' });
    } catch (error) {
        console.error('Error al completar la tarea:', error);
        res.status(500).json({ error: 'Error al completar la tarea', details: error.message });
    }
}

export async function verificarTarea(req, res) {
    try {
        const administradorID = req.user.id;
        const { progresoID } = req.body;

        console.log('Verificando tarea:', { administradorID, progresoID });

        await tareaService.verificarTarea(administradorID, progresoID);
        res.status(200).json({ message: 'Tarea verificada exitosamente' });
    } catch (error) {
        console.error('Error detallado al verificar la tarea:', error);

        if (error.message.includes('no es un administrador')) {
            res.status(403).json({ error: 'No tienes permisos de administrador para realizar esta acción' });
        } else if (error.message.includes('tarea no existe')) {
            res.status(404).json({ error: 'La tarea especificada no existe' });
        } else if (error.message.includes('No tienes permiso para verificar esta tarea')) {
            res.status(403).json({ error: 'No tienes permiso para verificar esta tarea específica' });
        } else {
            res.status(500).json({ error: 'Error al verificar la tarea', details: error.message });
        }
    }
}