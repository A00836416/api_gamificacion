
import * as tareaService from '../services/tareaService.js';

export async function crearTarea(req, res) {
    try {
        const tareaId = await tareaService.crearTarea(req.body);
        res.status(201).json({ id: tareaId, message: 'Tarea creada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la tarea' });
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
