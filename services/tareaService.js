
import { sql } from '../config/db.js';

export async function crearTarea(tarea, empleadosIDs = null) {
  try {
    const empleadosIDsString = empleadosIDs && empleadosIDs.length > 0 ? empleadosIDs.join(',') : null;
    console.log('empleadosIDsString:', empleadosIDsString); // Para depuración

    const result = await sql.query`
      EXEC sp_CrearTareaConAsignaciones
        @nombre = ${tarea.nombre},
        @descripcion = ${tarea.descripcion},
        @duracionEstimada = ${tarea.duracionEstimada},
        @experienciaBase = ${tarea.experienciaBase},
        @fechaLimite = ${tarea.fechaLimite},
        @esObligatoria = ${tarea.esObligatoria},
        @empleadosIDs = ${empleadosIDsString}
    `;

    console.log('Resultado de sp_CrearTareaConAsignaciones:', result);

    if (result.recordset && result.recordset.length > 0) {
      return result.recordset[0].tareaID;
    } else {
      throw new Error('No se recibió un ID de tarea válido del procedimiento almacenado.');
    }
  } catch (error) {
    console.error('Error detallado al crear tarea:', error);
    throw error;
  }
}

export async function obtenerTareas() {
  try {
    const result = await sql.query`
      SELECT 
        t.tareaID,
        t.nombre,
        (SELECT descripcion FROM Tarea WHERE tareaID = t.tareaID) AS descripcion,
        t.duracionEstimada,
        t.experienciaBase,
        t.fechaLimite,
        t.esObligatoria,
        t.createdAt,
        t.updatedAt,
        COUNT(pt.empleadoID) AS cantidadEmpleados
      FROM 
        Tarea t
      LEFT JOIN 
        ProgresoTarea pt ON t.tareaID = pt.tareaID
      WHERE 
        t.deletedAt IS NULL
      GROUP BY
        t.tareaID, t.nombre, t.duracionEstimada, t.experienciaBase,
        t.fechaLimite, t.esObligatoria, t.createdAt, t.updatedAt
    `;
    return result.recordset;
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    throw error;
  }
}

export async function obtenerTareasEmpleado(usuarioID) {
  try {
    const result = await sql.query`
      SELECT * FROM vw_TareasConProgresoEmpleado
      WHERE usuarioID = ${usuarioID} OR usuarioID IS NULL
    `;

    const tareas = result.recordset.map(row => ({
      tareaID: row.tareaID,
      nombreTarea: row.nombreTarea,
      descripcionTarea: row.descripcionTarea,
      duracionEstimada: row.duracionEstimada,
      experienciaBase: row.experienciaBase,
      fechaCreacionTarea: row.fechaCreacionTarea,
      fechaLimite: row.fechaLimite,
      esObligatoria: row.esObligatoria,
      dimension: row.dimensionID ? {
        dimensionID: row.dimensionID,
        nombre: row.nombreDimension
      } : null,
      nivel: row.nivelID ? {
        nivelID: row.nivelID,
        nombre: row.nombreNivel,
        numero: row.numeroNivel
      } : null,
      progresoEmpleado: row.progresoID ? {
        progresoID: row.progresoID,
        fechaInicio: row.fechaInicioProgreso,
        fechaFinalizacion: row.fechaFinalizacionProgreso,
        estado: row.estadoTarea,
        tiempoCompletado: row.tiempoCompletado
      } : null
    }));


    return tareas;
  } catch (error) {
    console.error('Error al obtener tareas con progreso del empleado:', error);
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

export async function iniciarTarea(empleadoID, tareaID) {
  try {
    await sql.query`EXEC sp_IniciarTarea @usuarioID = ${empleadoID}, @tareaID = ${tareaID}`;
  } catch (error) {
    console.error('Error al iniciar tarea:', error);
    throw error;
  }
}

export async function completarTarea(empleadoID, tareaID) {
  try {
    await sql.query`EXEC sp_CompletarTarea @usuarioID = ${empleadoID}, @tareaID = ${tareaID}`;
  } catch (error) {
    console.error('Error al completar tarea:', error);
    throw error;
  }
}

export async function verificarTarea(administradorID, progresoID) {
  try {
    await sql.query`EXEC sp_VerificarTarea @usuarioID = ${administradorID}, @progresoID = ${progresoID}`;
  } catch (error) {
    console.error('Error al verificar tarea:', error);
    throw error;
  }
}
