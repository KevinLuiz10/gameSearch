const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./src/config/db');


const authRoutes = require('./src/routes/authRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

//Rota teste
app.get('/', (req, res) => {
    res.send('Backend do GameSearch está a rodar!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`\nServidor a rodar na porta ${PORT}`);
    try {
        const [rows] = await db.query('SELECT 1');
        console.log('✅ Conexão com MySQL bem-sucedida!');
    } catch (error) {
        console.error('❌ Erro fatal ao conectar no banco:', error.message);
    }
});
