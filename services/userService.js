import { sql } from '../config/db.js';


async function updateUserPassword(usuarioID, newPassword) {
    try {
        await sql.query`
            UPDATE Usuario
            SET contrasena = ${newPassword}
            WHERE usuarioID = ${usuarioID}
        `;
    } catch (error) {
        console.error('Error al actualizar la contraseña del usuario:', error);
        throw error;
    }
}

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
            SELECT * FROM vw_GetUserExperienceLevel WHERE usuarioID = @usuarioID;
        `;
        return result.recordset[0];
    } catch (error) {
        console.error('Error al buscar usuario por ID:', error);
        throw error;
    }
}
async function updateUser(userData) {
    try {
        await sql.query`
            EXEC sp_ActualizarUsuario 
                @usuarioID = ${userData.usuarioID},
                @userName = ${userData.userName},
                @nombre = ${userData.nombre},
                @apellidoPaterno = ${userData.apellidoPaterno},
                @apellidoMaterno = ${userData.apellidoMaterno},
                @correoElectronico = ${userData.correoElectronico},
                @sexo = ${userData.sexo},
                @posicion = ${userData.posicion}
        `;
        return { success: true };
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        throw error;
    }
}

async function updateProfilePicture(usuarioID, fotoPerfilPath) {
    try {
        await sql.query`
            UPDATE Usuario
            SET fotoPerfil = ${fotoPerfilPath}, updatedAt = GETDATE()
            WHERE usuarioID = ${usuarioID}
        `;
        return { success: true };
    } catch (error) {
        console.error('Error al actualizar la foto de perfil:', error);
        throw error;
    }
}

export { createUser, findUserByUserName, updateLastAccess, findUserById, updateUser, updateUserPassword, updateProfilePicture };
