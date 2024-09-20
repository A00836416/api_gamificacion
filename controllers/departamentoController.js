
import * as departamentoService from '../services/departamentoService.js';

export async function crearDepartamento(req, res) {
  try {
    const { nombre, descripcion } = req.body;
    const departamentoId = await departamentoService.crearDepartamento(nombre, descripcion);
    res.status(201).json({ id: departamentoId, message: 'Departamento creado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el departamento' });
  }
}

export async function obtenerDepartamentos(req, res) {
  try {
    const departamentos = await departamentoService.obtenerDepartamentos();
    res.json(departamentos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los departamentos' });
  }
}

export async function obtenerDepartamento(req, res) {
  try {
    const departamento = await departamentoService.obtenerDepartamentoPorId(req.params.id);
    if (departamento) {
      res.json(departamento);
    } else {
      res.status(404).json({ error: 'Departamento no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el departamento' });
  }
}

export async function actualizarDepartamento(req, res) {
  try {
    const { nombre, descripcion } = req.body;
    await departamentoService.actualizarDepartamento(req.params.id, nombre, descripcion);
    res.json({ message: 'Departamento actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el departamento' });
  }
}

export async function eliminarDepartamento(req, res) {
  try {
    await departamentoService.eliminarDepartamento(req.params.id);
    res.json({ message: 'Departamento eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el departamento' });
  }
}