import { sql } from '../config/db.js';

async function createUser(userData) {
    try {
        const result = await sql.query`
      INSERT INTO Usuario (userName, contrasena, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, correoElectronico, rol)
      OUTPUT INSERTED.usuarioID
      VALUES (${userData.userName}, ${userData.contrasena}, ${userData.nombre}, ${userData.apellidoPaterno}, ${userData.apellidoMaterno}, ${userData.fechaNacimiento}, ${userData.correoElectronico}, ${userData.rol})
    `;
        return result.recordset[0].usuarioID;
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
}

async function findUserByUserName(userName) {
    try {
        const result = await sql.query`
      SELECT * FROM Usuario WHERE userName = ${userName}
    `;
        return result.recordset[0];
    } catch (error) {
        console.error('Error al buscar usuario:', error);
        throw error;
    }
}

async function updateLastAccess(usuarioID) {
    try {
        await sql.query`
      UPDATE Usuario SET ultimoAcceso = GETDATE() WHERE usuarioID = ${usuarioID}
    `;
    } catch (error) {
        console.error('Error al actualizar último acceso:', error);
        throw error;
    }
}

async function findUserById(usuarioID) {
    try {
        const request = new sql.Request();
        request.input('usuarioID', sql.UniqueIdentifier, usuarioID);
        const result = await request.query`
        SELECT usuarioID, userName, nombre, apellidoPaterno, apellidoMaterno, 
               fechaNacimiento, correoElectronico, esActivo, ultimoAcceso, rol
        FROM Usuario 
        WHERE usuarioID = @usuarioID
      `;
        return result.recordset[0];
    } catch (error) {
        console.error('Error al buscar usuario por ID:', error);
        throw error;
    }
}

export { createUser, findUserByUserName, updateLastAccess, findUserById };
