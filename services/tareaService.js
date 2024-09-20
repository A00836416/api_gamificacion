
import { sql } from '../config/db.js';

export async function crearTarea(tarea) {
  try {
    const result = await sql.query`
      INSERT INTO Tarea (nombre, descripcion, duracionEstimada, experienciaBase, fechaLimite, esObligatoria)
      OUTPUT INSERTED.tareaID
      VALUES (${tarea.nombre}, ${tarea.descripcion}, ${tarea.duracionEstimada}, ${tarea.experienciaBase}, ${tarea.fechaLimite}, ${tarea.esObligatoria})
    `;
    return result.recordset[0].tareaID;
  } catch (error) {
    console.error('Error al crear tarea:', error);
    throw error;
  }
}

export async function obtenerTareas() {
  try {
    const result = await sql.query`
      SELECT * FROM Tarea WHERE deletedAt IS NULL
    `;
    return result.recordset;
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    throw error;
  }
}

export async function obtenerTareaPorId(id) {
  try {
    const result = await sql.query`
      SELECT * FROM Tarea WHERE tareaID = ${id} AND deletedAt IS NULL
    `;
    return result.recordset[0];
  } catch (error) {
    console.error('Error al obtener tarea:', error);
    throw error;
  }
}

export async function actualizarTarea(id, tarea) {
  try {
    await sql.query`
      UPDATE Tarea
      SET nombre = ${tarea.nombre}, descripcion = ${tarea.descripcion}, 
          duracionEstimada = ${tarea.duracionEstimada}, experienciaBase = ${tarea.experienciaBase}, 
          fechaLimite = ${tarea.fechaLimite}, esObligatoria = ${tarea.esObligatoria}, 
          updatedAt = GETDATE()
      WHERE tareaID = ${id}
    `;
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    throw error;
  }
}

export async function eliminarTarea(id) {
  try {
    await sql.query`
      UPDATE Tarea
      SET deletedAt = GETDATE()
      WHERE tareaID = ${id}
    `;
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    throw error;
  }
}