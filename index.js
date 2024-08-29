import express from 'express'
import { PORT } from './config.js'

// const axios = require('axios');

const app = express();

app.get('/', (req, res) => {
    res.send('¡Hola Mundo!');
});
app.post('/login', (req, res) => {
    res.json({ user: 'harold' })
})
app.post('/register', (req, res) => { })
app.post('/logout', (req, res) => { })

app.post('/protected', (req, res) => { })

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});