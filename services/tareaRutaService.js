// models/tareaRutaService.js
import { sql } from '../config/db.js';

export async function asignarTareaARuta(tareaID, departamentoID, orden) {
    try {
        await sql.query`
      INSERT INTO TareaRuta (tareaID, departamentoID, orden)
      VALUES (${tareaID}, ${departamentoID}, ${orden})
    `;
    } catch (error) {
        console.error('Error al asignar tarea a ruta:', error);
        throw error;
    }
}

export async function obtenerTareasDeRuta(departamentoID) {
    try {
        const result = await sql.query`
      SELECT t.tareaID, t.nombre, t.descripcion, tr.orden
      FROM TareaRuta tr
      INNER JOIN Tarea t ON tr.tareaID = t.tareaID
      WHERE tr.departamentoID = ${departamentoID}
      ORDER BY tr.orden
    `;
        return result.recordset;
    } catch (error) {
        console.error('Error al obtener tareas de ruta:', error);
        throw error;
    }
}