import { sql } from '../config/db.js';

export async function getTaskProgress(req, res) {
    try {
        const result = await sql.query`
            SELECT 
                pt.progresoID,
                e.empleadoID,
                u.nombre + ' ' + u.apellidoPaterno AS nombreEmpleado,
                t.tareaID,
                t.nombre AS nombreTarea,
                t.descripcion AS descripcionTarea,
                pt.fechaInicio,
                pt.fechaFinalizacion,
                et.nombre AS estadoTarea,
                pt.tiempoCompletado,
                pt.verificadoPor,
                pt.fechaVerificacion
            FROM 
                ProgresoTarea pt
                INNER JOIN Empleado e ON pt.empleadoID = e.empleadoID
                INNER JOIN Usuario u ON e.usuarioID = u.usuarioID
                INNER JOIN Tarea t ON pt.tareaID = t.tareaID
                INNER JOIN EstadoTarea et ON pt.estadoID = et.estadoID
            ORDER BY 
                pt.fechaInicio DESC
        `;

        res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener el progreso de las tareas:', error);
        res.status(500).json({ error: 'Error al obtener el progreso de las tareas' });
    }
}

export async function verifyTask(req, res) {
    const { progresoID } = req.params;
    const { aprobada } = req.body;
    const verificadorID = req.user.id; // Asumiendo que el ID del administrador está en req.user

    try {
        await sql.query`
            EXEC sp_VerificarTarea @progresoID = ${progresoID}, @verificadorID = ${verificadorID}, @aprobada = ${aprobada}
        `;

        res.json({ message: 'Task verified successfully' });
    } catch (error) {
        console.error('Error verifying task:', error);
        res.status(500).json({ error: 'Error verifying task' });
    }
}