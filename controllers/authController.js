import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByUserName, updateLastAccess } from '../models/userModel.js';

export async function register(req, res) {
    try {
        const {
            userName,
            contrasena,
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            fechaNacimiento,
            correoElectronico,
            rol
        } = req.body;

        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const usuarioID = await createUser({
            userName,
            contrasena: hashedPassword,
            nombre,
            apellidoPaterno,
            apellidoMaterno,
            fechaNacimiento,
            correoElectronico,
            rol
        });

        res.status(201).json({ message: 'Usuario registrado exitosamente', usuarioID });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
}

export async function login(req, res) {
    try {
        const { userName, contrasena } = req.body;
        const user = await findUserByUserName(userName);
        if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });

        if (!user.esActivo) return res.status(400).json({ error: 'Usuario inactivo' });

        const validPassword = await bcrypt.compare(contrasena, user.contrasena);
        if (!validPassword) return res.status(400).json({ error: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: user.usuarioID, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000 // 1 hora
        });

        req.session.userId = user.usuarioID;

        await updateLastAccess(user.usuarioID);

        res.json({ message: 'Login exitoso', token, rol: user.rol });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el login' });
    }
}

export function logout(req, res) {
    res.clearCookie('jwt');
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }
        res.json({ message: 'Sesión cerrada exitosamente' });
    });
}