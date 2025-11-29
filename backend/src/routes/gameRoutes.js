const express = require('express');
const router = express.Router();
const verifyToken = require('../config/auth');
const redisClient = require('../config/redis');
const db = require('../config/db');
// Importação atualizada: desestruturamos para pegar os loggers específicos
const { logger, searchLogger, postLogger } = require('../config/logger');

const CACHE_DURATION = 60; // 60 segundos de cache

//BUSCA NO BANCO DE DADOS
const fetchLocalGames = async (category, search) => {
    try {
        let sql = 'SELECT * FROM games WHERE is_public = true';
        const params = [];

        // Filtro por Categoria no Banco (se não for 'all')
        if (category && category !== 'all') {
            // Ex: Se o jogo é "Shooter", e buscamos "shooter", o LIKE resolve.
            sql += ' AND genre LIKE ?';
            params.push(`%${category}%`);
        }

        if (search) {
            sql += ' AND title LIKE ?';
            params.push(`%${search}%`);
        }

        sql += ' ORDER BY created_at DESC';

        const [rows] = await db.execute(sql, params);

        return rows;
    } catch (error) {
        logger.error(`Erro ao buscar jogos locais: ${error.message}`);
        return [];
    }
};

// GET /api/games
router.get('/', verifyToken, async (req, res) => {
    try {
        const { category, search } = req.query;
        const userId = req.user.id; // ID do usuário que buscou (vem do token)

        // --- LOG DE BUSCA (Arquivo search_history.log) ---
        searchLogger.info(`User ID: ${userId} | Termo: "${search || ''}" | Categoria: "${category || 'all'}"`);

        let categoriesList = [];
        if (category && category !== 'all') {
            categoriesList = category.split(',').map(c => c.trim()).filter(c => c);
        }
        const sortedCats = categoriesList.length > 0 ? categoriesList.sort().join(',') : 'all';
        const cacheKey = `games_${sortedCats}_${search || ''}`;

        let gamesData = [];

        // TENTA BUSCAR NO REDIS
        try {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                logger.info(`⚡ Usando Cache do Redis para: ${cacheKey}`);
                return res.json(JSON.parse(cachedData));
            }
        } catch (redisError) {
            logger.error(`Erro Redis: ${redisError.message}`);
        }

        console.log(`Realizando requisição externa (API + DB): ${cacheKey}`);

        // BUSCA NA API EXTERNA
        const fetchExternal = async () => {

            if (categoriesList.length > 1) {
                // Múltiplas categorias
                const promises = categoriesList.map(async (cat) => {
                    try {
                        const response = await fetch(`https://www.freetogame.com/api/games?category=${cat}`);
                        if (!response.ok) return [];
                        return await response.json();
                    } catch (e) { return []; }
                });
                const results = await Promise.all(promises);
                return results.flat();
            } else {
                // Uma categoria ou 'all'
                let url = 'https://www.freetogame.com/api/games';
                if (categoriesList.length === 1) url += `?category=${categoriesList[0]}`;

                try {
                    const response = await fetch(url);
                    if (!response.ok) return [];
                    return await response.json();
                } catch (e) { return []; }
            }
        };

        //BUSCA NO BANCO DE DADOS
        const [externalGames, localGames] = await Promise.all([
            fetchExternal(),
            fetchLocalGames(sortedCats === 'all' ? null : sortedCats, search)
        ]);

        // UNIFICAÇÃO E EXLUSÃO SE TIVER TÍTULO DUPLICADO
        let allGames = [...localGames, ...externalGames];

        // Deduplicação por Título (caso alguém cadastre um jogo que já existe na API)
        const uniqueGamesMap = new Map();
        allGames.forEach(game => {
            // Chave única: Título em minúsculo
            uniqueGamesMap.set(game.title.toLowerCase(), game);
        });

        gamesData = Array.from(uniqueGamesMap.values());

        // FILTRO DE TEXTO FINAL
        if (search) {
            const termo = search.toLowerCase();
            gamesData = gamesData.filter(game =>
                game.title.toLowerCase().includes(termo)
            );
        }

        // SALVAMENTO NO REDIS
        try {
            if (gamesData.length > 0) {
                await redisClient.set(cacheKey, JSON.stringify(gamesData), {
                    EX: CACHE_DURATION
                });
            }
        } catch (e) { logger.error(`Erro salvar Redis: ${e.message}`); }

        res.json(gamesData);

    } catch (error) {
        logger.error(`Erro rota games: ${error.message}`);
        res.status(500).json({ message: 'Erro interno ao buscar jogos.' });
    }
});

//ENDPOINT INSERÇÃO
// POST /api/games
router.post('/', verifyToken, async (req, res) => {
    try {
        const { title, thumbnail, short_description, game_url, genre, platform } = req.body;
        const userId = req.user.id;

        // VALIDAÇÃO DE CAMPOS
        if (!title || !short_description || !game_url || !genre) {
            return res.status(400).json({
                message: 'Campos obrigatórios: Título, Descrição, URL e Gênero.'
            });
        }

        // INSERÇÃO NO BANCO
        const sql = `
            INSERT INTO games (title, thumbnail, short_description, game_url, genre, platform, user_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(sql, [
            title,
            thumbnail || 'https://via.placeholder.com/300x200?text=No+Image', // Imagem padrão se vazio
            short_description,
            game_url,
            genre,
            platform || 'Web Browser', // Pataforma padrão se vazio
            userId
        ]);

        const newGameId = result.insertId;

        // --- LOG DE POSTAGEM (Arquivo post_history.log) ---
        postLogger.info(`User ID: ${userId} | Novo Jogo ID: ${newGameId} | Título: "${title}" | Gênero: "${genre}"`);

        // LIMPEZA DE CACHE QUANDO OCORRE UMA INCLUSÃO
        await redisClient.del('games_all_');
        if (genre) await redisClient.del(`games_${genre.toLowerCase()}_`);

        // logger.info(`✅ Jogo inserido: ID ${newGameId} - ${title}`);

        res.status(201).json({
            message: 'Jogo cadastrado com sucesso!',
            gameId: newGameId
        });

    } catch (error) {
        logger.error(`Erro ao inserir jogo: ${error.message}`);
        res.status(500).json({ message: 'Erro ao cadastrar jogo.' });
    }
});

module.exports = router;