import * as notificationService from '../services/notificationService.js';


export async function obtenerNotificacionesPorUsuario(req, res) {
    try {

        const notificaciones = await notificationService.obtenerNotificacionesPorUsuario(req.user.id);
        res.json(notificaciones);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener notificaciones del usuario' });
    }
}