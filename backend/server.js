const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./src/config/db'); // Importa nossa conexão

// Carrega variáveis de ambiente
dotenv.config();

const app = express();

// --- Configurações Básicas ---
// O CORS permite que o Frontend (que roda em outra porta) acesse este Backend
app.use(cors());
// Permite que o servidor entenda JSON (quando o front manda dados)
app.use(express.json());

// --- Rota de Teste (Só pra ver se está vivo) ---
app.get('/', (req, res) => {
    res.send('Backend rodando');
});

// --- Iniciar o Servidor ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`\nServidor rodando na porta ${PORT}`);

    // Testar conexão com o banco ao ligar
    try {
        // Faz uma consulta simples (SELECT 1) só para ver se o banco responde
        const [rows] = await db.query('SELECT 1');
        console.log('✅ Conexão com MySQL bem-sucedida!');
    } catch (error) {
        console.error('❌ Erro fatal ao conectar no banco:', error.message);
        console.error('   -> Verifique se o MySQL está ligado e se o arquivo .env está correto.');
    }
});