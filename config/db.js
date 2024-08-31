// config/db.js
import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

// Verifica que las variables de entorno necesarias estén definidas
const requiredEnvVars = ['DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_NAME'];
for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
        console.error(`Error: La variable de entorno ${varName} no está definida`);
        process.exit(1);
    }
}

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST, // Asegúrate de que esto sea una cadena válida
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // Para conexiones Azure
        trustServerCertificate: true, // Cambiar a false si tienes un certificado válido
    },
};

async function connectDB() {
    try {
        await sql.connect(config);
        console.log('Conectado a SQL Server');
    } catch (err) {
        console.error('Error de conexión a SQL Server:', err);
        process.exit(1);
    }
}

export { sql, connectDB };