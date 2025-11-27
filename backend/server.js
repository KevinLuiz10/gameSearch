const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./src/config/db');

// --- IMPORTAÇÃO DAS ROTAS ---
const authRoutes = require('./src/routes/authRoutes');
const gameRoutes = require('./src/routes/gameRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);   // http://localhost:3000/api/auth/login
app.use('/api/games', gameRoutes);  // http://localhost:3000/api/games (GET)

// Teste simples para ver se o servidor está no ar
app.get('/', (req, res) => {
    res.send('Backend do GameSearch está rodando com sucesso!');
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`\nServidor rodando na porta ${PORT}`);

    // Teste de conexão com o Banco de Dados ao iniciar
    try {
        const [rows] = await db.query('SELECT 1');
        console.log('✅ Conexão com MySQL bem-sucedida!');
        console.log('📡 Rotas disponíveis:');
        console.log('   - POST /api/auth/login');
        console.log('   - GET  /api/games');
    } catch (error) {
        console.error('❌ Erro fatal ao conectar no banco:', error.message);
        console.error('   -> Verifique se o MySQL está ligado e se o .env está correto.');
    }
});