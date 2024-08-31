import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
    const token = req.cookies.jwt || req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Acceso denegado' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Token no válido' });
    }
}

function isAdmin(req, res, next) {
    if (req.user && req.user.rol === 'administrador') {
        next();
    } else {
        res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador.' });
    }
}

export { authMiddleware, isAdmin };