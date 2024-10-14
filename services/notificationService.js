import { sql } from '../config/db.js';

export async function obtenerNotificacionesPorUsuario(usuarioID) {
    try {
        const result = await sql.query`
        SELECT * FROM vw_NotificacionesUsuario
        WHERE usuarioID = ${usuarioID}
        ORDER BY fechaCreacion DESC
    `;
        console.log(result);
        return result.recordset;
    } catch (error) {
        console.error('Error al obtener notificaciones por usuario:', error);
        throw error;
    }
}

