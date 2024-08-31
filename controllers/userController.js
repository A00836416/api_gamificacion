import { findUserById } from '../models/userModel.js';

function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

export async function getUser(req, res) {
    try {
        const usuarioID = req.params.id;

        if (!isValidUUID(usuarioID)) {
            return res.status(400).json({ error: 'ID de usuario inválido' });
        }

        const user = await findUserById(usuarioID);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Eliminamos la contraseña de la respuesta por seguridad
        const { contrasena, ...userWithoutPassword } = user;

        res.json(userWithoutPassword);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        if (error.code === 'EPARAM') {
            return res.status(400).json({ error: 'Formato de ID de usuario inválido' });
        }
        res.status(500).json({ error: 'Error al obtener información del usuario' });
    }
}