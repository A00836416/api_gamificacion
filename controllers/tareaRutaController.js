import * as tareaRutaService from '../services/tareaRutaService.js';

export async function asignarTareaARuta(req, res) {
    try {
        const { tareaID, departamentoID, orden } = req.body;
        await tareaRutaService.asignarTareaARuta(tareaID, departamentoID, orden);
        res.status(201).json({ message: 'Tarea asignada a ruta exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al asignar tarea a ruta' });
    }
}

export async function obtenerTareasDeRuta(req, res) {
    try {
        const { departamentoID } = req.params;
        const tareas = await tareaRutaService.obtenerTareasDeRuta(departamentoID);
        res.json(tareas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener tareas de ruta' });
    }
}
