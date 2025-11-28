const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'gamesearch_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const db = pool.promise();

// Teste de conexão
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar no MySQL:', err.message);
    } else {
        console.log('Conectado ao MySQL com Pool de Conexões');
        connection.release();
    }
});

module.exports = db;