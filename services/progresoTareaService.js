import { sql } from '../config/db.js';

export async function crearProgresoTarea(empleadoID, tareaID) {
  try {
    const result = await sql.query`
      INSERT INTO ProgresoTarea (empleadoID, tareaID, estadoID)
      OUTPUT INSERTED.progresoID
      VALUES (${empleadoID}, ${tareaID}, (SELECT estadoID FROM EstadoTarea WHERE nombre = 'No Iniciada'))
    `;
    return result.recordset[0].progresoID;
  } catch (error) {
    console.error('Error al crear progreso de tarea:', error);
    throw error;
  }
}

export async function obtenerProgresoTareas(empleadoID) {
  try {
    const result = await sql.query`
      SELECT pt.progresoID, t.nombre AS nombreTarea, et.nombre AS estado, pt.fechaInicio, pt.fechaFinalizacion
      FROM ProgresoTarea pt
      INNER JOIN Tarea t ON pt.tareaID = t.tareaID
      INNER JOIN EstadoTarea et ON pt.estadoID = et.estadoID
      WHERE pt.empleadoID = ${empleadoID}
    `;
    return result.recordset;
  } catch (error) {
    console.error('Error al obtener progreso de tareas:', error);
    throw error;
  }
}
