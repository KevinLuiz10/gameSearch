const redis = require('redis');
require('dotenv').config();


const redisHost = process.env.REDIS_HOST || 'localhost';

const redisClient = redis.createClient({
    // Monta a URL no formato: redis://redis:6379
    url: `redis://${redisHost}:6379`
});

redisClient.on('error', (err) => {
    // Esse log ajuda a saber se o erro é de conexão
    console.error('Erro no cliente Redis:', err);
});

redisClient.on('connect', () => {
    console.log(`Conectado ao Redis em: ${redisHost}`);
});

(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('Falha crítica ao conectar no Redis:', err);
    }
})();

module.exports = redisClient;