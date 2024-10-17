import { getRankingSemanal } from '../services/rankingService.js';

export async function obtenerRankingSemanal(req, res) {
    try {
        const fecha = req.query.fecha || null; // Si no se proporciona fecha, se usará la fecha actual
        const ranking = await getRankingSemanal(fecha);
        res.json(ranking);
    } catch (error) {
        console.error('Error al obtener ranking semanal:', error);
        res.status(500).json({ error: 'Error al obtener el ranking semanal' });
    }
}