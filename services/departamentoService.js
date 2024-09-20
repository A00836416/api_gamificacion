
import { sql } from '../config/db.js';

export async function crearDepartamento(nombre, descripcion) {
  try {
    const result = await sql.query`
      INSERT INTO Departamento (nombre, descripcion)
      OUTPUT INSERTED.departamentoID
      VALUES (${nombre}, ${descripcion})
    `;
    return result.recordset[0].departamentoID;
  } catch (error) {
    console.error('Error al crear departamento:', error);
    throw error;
  }
}

export async function obtenerDepartamentos() {
  try {
    const result = await sql.query`
      SELECT * FROM Departamento WHERE deletedAt IS NULL
    `;
    return result.recordset;
  } catch (error) {
    console.error('Error al obtener departamentos:', error);
    throw error;
  }
}

export async function obtenerDepartamentoPorId(id) {
  try {
    const result = await sql.query`
      SELECT * FROM Departamento WHERE departamentoID = ${id} AND deletedAt IS NULL
    `;
    return result.recordset[0];
  } catch (error) {
    console.error('Error al obtener departamento:', error);
    throw error;
  }
}

export async function actualizarDepartamento(id, nombre, descripcion) {
  try {
    await sql.query`
      UPDATE Departamento
      SET nombre = ${nombre}, descripcion = ${descripcion}, updatedAt = GETDATE()
      WHERE departamentoID = ${id}
    `;
  } catch (error) {
    console.error('Error al actualizar departamento:', error);
    throw error;
  }
}

export async function eliminarDepartamento(id) {
  try {
    await sql.query`
      UPDATE Departamento
      SET deletedAt = GETDATE()
      WHERE departamentoID = ${id}
    `;
  } catch (error) {
    console.error('Error al eliminar departamento:', error);
    throw error;
  }
}