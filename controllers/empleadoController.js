import * as empleadoService from '../services/empleadoService.js';


export async function completarPerfilEmpleado(req, res) {
    try {
        const { usuarioID } = req.params;
        const datosEmpleado = req.body;
        const empleadoID = await empleadoService.completarPerfilEmpleado(usuarioID, datosEmpleado);
        res.json({ empleadoID, message: 'Perfil de empleado completado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al completar perfil de empleado' });
    }
}

export async function crearUsuarioYEmpleado(req, res) {
    try {
        const { datosUsuario, datosEmpleado } = req.body;
        const resultado = await empleadoService.crearUsuarioYEmpleado(datosUsuario, datosEmpleado);
        res.status(201).json({
            message: 'Usuario y empleado creados exitosamente',
            usuarioID: resultado.usuarioID,
            empleadoID: resultado.empleadoID
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear usuario y empleado' });
    }
}

export async function asignarEmpleadoADepartamento(req, res) {
    try {
        const { empleadoID, departamentoID } = req.body;
        await empleadoService.asignarEmpleadoADepartamento(empleadoID, departamentoID);
        res.json({ message: 'Empleado asignado a departamento exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al asignar empleado a departamento' });
    }
}

export async function obtenerEmpleados(req, res) {
    try {
        const empleados = await empleadoService.obtenerEmpleados();
        res.json(empleados);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener empleados por departamento' });
    }
}

export async function obtenerEmpleadosPorDepartamento(req, res) {
    try {
        const { departamentoID } = req.params;
        const empleados = await empleadoService.obtenerEmpleadosPorDepartamento(departamentoID);
        res.json(empleados);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener empleados por departamento' });
    }
}

export async function actualizarPosicionEmpleado(req, res) {
    try {
        const { empleadoID, nuevaPosicion } = req.body;
        await empleadoService.actualizarPosicionEmpleado(empleadoID, nuevaPosicion);
        res.json({ message: 'Posición del empleado actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar posición del empleado' });
    }
}

export async function obtenerDetallesEmpleado(req, res) {
    try {
        const { empleadoID } = req.params;
        const detalles = await empleadoService.obtenerDetallesEmpleado(empleadoID);
        res.json({ detalles });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener detalles del empleado' });
    }
}

export async function obtenerTareasEnProgresoEmpleado(req, res) {
    try {
        const { empleadoID } = req.params;
        const tareas = await empleadoService.obtenerTareasPorFaseEmpleado(empleadoID);
        res.json(tareas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener tareas en progreso del empleado' });
    }
}