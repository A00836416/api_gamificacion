import { objetoOficinaService } from '../services/objetoOficinaService.js';

export const objetoOficinaController = {
    async upsertObjetoOficina(req, res) {
        try {
            const usuarioID = req.user.id; // Asumiendo que el ID del usuario está en req.user.id
            const result = await objetoOficinaService.upsertObjetoOficina(usuarioID, req.body);
            res.json({ message: 'Objeto de oficina actualizado/insertado con éxito', result });
        } catch (error) {
            console.error('Error en upsertObjetoOficina controller:', error);
            res.status(500).json({ error: 'Error al procesar la solicitud' });
        }
    },

    async getObjetosHabilitados(req, res) {
        try {
            const usuarioID = req.user.id; // Asumiendo que el ID del usuario está en req.user.id
            const objetos = await objetoOficinaService.getObjetosHabilitados(usuarioID);
            res.json(objetos);
        } catch (error) {
            console.error('Error en getObjetosHabilitados controller:', error);
            res.status(500).json({ error: 'Error al obtener los objetos habilitados' });
        }
    }
};