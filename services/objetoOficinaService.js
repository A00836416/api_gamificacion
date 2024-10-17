import { sql } from '../config/db.js';

export const objetoOficinaService = {
    async upsertObjetoOficina(usuarioID, objetoData) {
        try {
            const result = await sql.query`
                EXEC sp_UpsertObjetoOficina
                    @UsuarioID = ${usuarioID},
                    @ObjetoID = ${objetoData.objetoID},
                    @PositionX = ${objetoData.positionX},
                    @PositionY = ${objetoData.positionY},
                    @SortingLayer = ${objetoData.sortingLayer},
                    @OrderInLayer = ${objetoData.orderInLayer},
                    @ObjectDirections = ${objetoData.objectDirections},
                    @SpriteDerecha = ${objetoData.spriteDerecha},
                    @SpriteIzquierda = ${objetoData.spriteIzquierda},
                    @SpriteAbajo = ${objetoData.spriteAbajo},
                    @BaseSortingOrder = ${objetoData.baseSortingOrder},
                    @SortingOffset = ${objetoData.sortingOffset},
                    @DynamicSorting = ${objetoData.dynamicSorting}
            `;
            return result;
        } catch (error) {
            console.error('Error en upsertObjetoOficina:', error);
            throw error;
        }
    },

    async getObjetosHabilitados(usuarioID) {
        try {
            const result = await sql.query`
                SELECT * FROM vw_ObjetosHabilitadosUsuarios
                WHERE usuarioID = ${usuarioID}
            `;
            return result.recordset;
        } catch (error) {
            console.error('Error en getObjetosHabilitados:', error);
            throw error;
        }
    }
};