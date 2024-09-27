import { sql } from '../config/db.js';
import bcrypt from 'bcrypt';

export async function completarPerfilEmpleado(usuarioID, datosEmpleado) {
    try {
        const result = await sql.query`
      UPDATE Empleado
      SET 
        posicion = ${datosEmpleado.posicion},
        departamentoID = ${datosEmpleado.departamentoID},
        supervisorID = ${datosEmpleado.supervisorID},
        fechaIngreso = ${datosEmpleado.fechaIngreso}
      OUTPUT INSERTED.empleadoID
      WHERE usuarioID = ${usuarioID}
    `;
        return result.recordset[0].empleadoID;
    } catch (error) {
        console.error('Error al completar perfil de empleado:', error);
        throw error;
    }
}

export async function crearUsuarioYEmpleado(datosUsuario, datosEmpleado) {
    const transaction = new sql.Transaction();
    try {
        await transaction.begin();

        // Encriptar la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(datosUsuario.contrasena, saltRounds);

        // Crear usuario
        const resultUsuario = await transaction.request()
            .input('userName', sql.VarChar, datosUsuario.userName)
            .input('contrasena', sql.VarChar, hashedPassword)
            .input('nombre', sql.VarChar, datosUsuario.nombre)
            .input('apellidoPaterno', sql.VarChar, datosUsuario.apellidoPaterno)
            .input('apellidoMaterno', sql.VarChar, datosUsuario.apellidoMaterno)
            .input('fechaNacimiento', sql.Date, datosUsuario.fechaNacimiento)
            .input('correoElectronico', sql.VarChar, datosUsuario.correoElectronico)
            .input('rol', sql.VarChar, 'empleado')
            .query`
        INSERT INTO Usuario (userName, contrasena, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, correoElectronico, rol)
        OUTPUT INSERTED.usuarioID
        VALUES (@userName, @contrasena, @nombre, @apellidoPaterno, @apellidoMaterno, @fechaNacimiento, @correoElectronico, @rol)
      `;

        const usuarioID = resultUsuario.recordset[0].usuarioID;

        // Crear empleado
        const resultEmpleado = await transaction.request()
            .input('usuarioID', sql.UniqueIdentifier, usuarioID)
            .input('fechaIngreso', sql.Date, datosEmpleado.fechaIngreso)
            .input('posicion', sql.VarChar, datosEmpleado.posicion)
            .input('departamentoID', sql.UniqueIdentifier, datosEmpleado.departamentoID)
            .input('supervisorID', sql.UniqueIdentifier, datosEmpleado.supervisorID)
            .query`
        INSERT INTO Empleado (usuarioID, fechaIngreso, posicion, departamentoID, supervisorID)
        OUTPUT INSERTED.empleadoID
        VALUES (@usuarioID, @fechaIngreso, @posicion, @departamentoID, @supervisorID)
      `;

        const empleadoID = resultEmpleado.recordset[0].empleadoID;

        await transaction.commit();
        return { usuarioID, empleadoID };
    } catch (error) {
        await transaction.rollback();
        console.error('Error al crear usuario y empleado:', error);
        throw error;
    }
}

export async function asignarEmpleadoADepartamento(empleadoID, departamentoID) {
    try {
        await sql.query`
      UPDATE Empleado
      SET departamentoID = ${departamentoID}
      WHERE empleadoID = ${empleadoID}
    `;
    } catch (error) {
        console.error('Error al asignar empleado a departamento:', error);
        throw error;
    }
}

export async function obtenerEmpleados() {
    try {
        const result = await sql.query`
  SELECT e.empleadoID, u.nombre, u.apellidoPaterno, u.apellidoMaterno, e.posicion, d.nombre AS departamento, u.correoElectronico
FROM Empleado e
INNER JOIN Usuario u ON e.usuarioID = u.usuarioID
LEFT JOIN Departamento d ON e.departamentoID = d.departamentoID
    `;
        return result.recordset;
    } catch (error) {
        console.error('Error al obtener empleados por departamento:', error);
        throw error;
    }
}

export async function obtenerEmpleadosPorDepartamento(departamentoID) {
    try {
        const result = await sql.query`
      SELECT e.empleadoID, u.nombre, u.apellidoPaterno, u.apellidoMaterno, e.posicion
      FROM Empleado e
      INNER JOIN Usuario u ON e.usuarioID = u.usuarioID
      WHERE e.departamentoID = ${departamentoID}
    `;
        return result.recordset;
    } catch (error) {
        console.error('Error al obtener empleados por departamento:', error);
        throw error;
    }
}


export async function actualizarPosicionEmpleado(empleadoID, nuevaPosicion) {
    try {
        await sql.query`
      UPDATE Empleado
      SET posicion = ${nuevaPosicion}
      WHERE empleadoID = ${empleadoID}
    `;
    } catch (error) {
        console.error('Error al actualizar posición del empleado:', error);
        throw error;
    }
}

