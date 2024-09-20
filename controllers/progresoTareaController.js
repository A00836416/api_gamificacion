import * as progresoTareaService from '../services/progresoTareaService.js';

export async function crearProgresoTarea(req, res) {
    try {
        const { empleadoID, tareaID } = req.body;
        const progresoID = await progresoTareaService.crearProgresoTarea(empleadoID, tareaID);
        res.status(201).json({ progresoID, message: 'Progreso de tarea creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear progreso de tarea' });
    }
}

export async function obtenerProgresoTareas(req, res) {
    try {
        const { empleadoID } = req.params;
        const progresos = await progresoTareaService.obtenerProgresoTareas(empleadoID);
        res.json(progresos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener progreso de tareas' });
    }
}