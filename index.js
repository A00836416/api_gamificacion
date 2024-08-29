import express from 'express';
import { PORT } from './config.js';
import { UserRepository } from './user_repository.js';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Hola Mundo!');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserRepository.login({ username, password });
    res.send({ user })
  } catch (error) {
    res.status(401).send(error.message);
  }

});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  try {
    const id = await UserRepository.create({ username, password });
    res.send({ id });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post('/logout', (req, res) => {
  // Implementar lógica de logout
});

app.post('/protected', (req, res) => {
  // Implementar lógica para ruta protegida
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});