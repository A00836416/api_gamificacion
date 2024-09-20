// middlewares/isAdmin.js
export function isAdmin(req, res, next) {
  if (req.user && req.user.rol === 'administrador') {
    next();
  } else {
    res.status(403).json({ error: 'Acceso denegado. Se requieren permisos de administrador.' });
  }
}