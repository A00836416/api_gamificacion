import { sql } from '../config/db.js';

async function getRankingSemanal(fecha = null) {
    try {
        const result = await sql.query`
            EXEC sp_ObtenerRankingSemanal @fecha = ${fecha}
        `;
        return result.recordset;
    } catch (error) {
        console.error('Error al obtener el ranking semanal:', error);
        throw error;
    }
}

export { getRankingSemanal };