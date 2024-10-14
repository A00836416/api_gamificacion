import { findUserById, updateUser } from '../services/userService.js';

function isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

export async function getUser(req, res) {
    try {
        const usuarioID = req.user.id;

        console.log(usuarioID);

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

export async function updateUserInfo(req, res) {
    try {
        const usuarioID = req.user.id;
        const updatedData = req.body;

        if (!isValidUUID(usuarioID)) {
            return res.status(400).json({ error: 'ID de usuario inválido' });
        }

        const result = await updateUser({ usuarioID, ...updatedData });

        if (result.success) {
            const updatedUser = await findUserById(usuarioID);
            const { contrasena, ...userWithoutPassword } = updatedUser;
            res.json(userWithoutPassword);
        } else {
            res.status(500).json({ error: 'Error al actualizar la información del usuario' });
        }
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar información del usuario' });
    }
}