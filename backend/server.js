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

// --- FUNÇÃO PARA ESPERAR O BANCO DE DADOS ---
const startServer = async () => {
    let retries = 5;
    while (retries > 0) {
        try {
            // Tenta fazer uma query simples para ver se o banco responde
            await db.execute('SELECT 1');
            console.log('✅ Conectado ao MySQL com sucesso!');

            // Só inicia o servidor se o banco estiver OK
            app.listen(PORT, () => {
                console.log(`🚀 Servidor rodando na porta ${PORT}`);
            });
            return; // Sai da função e do loop

        } catch (error) {
            console.log(`⏳ Banco de dados ainda não está pronto. Tentando novamente em 5 segundos... (Restam ${retries} tentativas)`);
            console.error('Erro:', error.code); // Ex: ECONNREFUSED
            retries -= 1;
            // Espera 5 segundos antes de tentar de novo
            await new Promise(res => setTimeout(res, 5000));
        }
    }
    console.error('❌ Falha crítica: Não foi possível conectar ao banco após várias tentativas.');
    process.exit(1); // Encerra o container para o Docker tentar reiniciar do zero
};

// Inicia o processo
startServer();