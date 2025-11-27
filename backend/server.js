const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./src/config/db');

// --- IMPORTAÇÃO DAS ROTAS ---
const authRoutes = require('./src/routes/authRoutes');
const gameRoutes = require('./src/routes/gameRoutes');

dotenv.config();

const app = express();

// --- CONFIGURAÇÕES DO EXPRESS ---
app.use(cors());
app.use(express.json());

// --- DEFINIÇÃO DAS ROTAS ---
// Rota de Autenticação (Login/Logout)
// Endpoints: POST /api/auth/login, POST /api/auth/logout
app.use('/api/auth', authRoutes);

// Rota de Jogos (Busca/Cache)
// Endpoint: GET /api/games (Protegida por Token)
app.use('/api/games', gameRoutes);

// Rota de teste simples na raiz
app.get('/', (req, res) => {
    res.send('Backend do GameSearch está rodando!');
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`\nServidor rodando na porta ${PORT}`);

    // Teste de conexão com o Banco de Dados ao iniciar
    try {
        const [rows] = await db.query('SELECT 1');
        console.log('✅ Conexão com MySQL bem-sucedida!');
    } catch (error) {
        console.error('❌ Erro fatal ao conectar no banco:', error.message);
        console.error('   -> Verifique se o MySQL está ligado e se o .env está correto.');
    }
});