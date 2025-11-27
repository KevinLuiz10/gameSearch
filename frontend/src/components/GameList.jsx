import React, { useContext, useMemo, useState, useEffect } from 'react';
import { GameContext } from '../contexts/GameContext';
import GameCard from './GameCard';
import { Typography, CircularProgress, Box, Pagination, Stack } from '@mui/material';

const GameList = ({ searchTerm }) => {
    const { games, loading, error } = useContext(GameContext);

    // --- CONFIGURAÇÃO DA PAGINAÇÃO ---
    const ITEMS_PER_PAGE = 12; // 12 jogos (3 linhas de 4 colunas)
    const [page, setPage] = useState(1);

    // Filtra os jogos (como antes)
    const filteredGames = useMemo(() => {
        if (!searchTerm) return games;
        return games.filter((game) =>
            game.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [games, searchTerm]);

    // --- EFEITO: RESETAR PÁGINA ---
    // Se o usuário pesquisar algo novo, volta para a página 1 automaticamente
    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    // --- CÁLCULO DA FATIA (SLICE) ---
    // Calcula quais jogos mostrar na página atual
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentGames = filteredGames.slice(startIndex, endIndex);

    // Calcula o total de páginas para o componente do MUI saber até onde ir
    const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);

    // Função para mudar de página e subir a tela suavemente
    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ mt: 5 }}>
                <Typography color="error" variant="h5" align="center">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ py: 2, display: 'flex', flexDirection: 'column', gap: 4 }}>

            {filteredGames.length === 0 ? (
                <Typography variant="h6" align="center" color="textSecondary" sx={{ mt: 5 }}>
                    Nenhum jogo encontrado.
                </Typography>
            ) : (
                <>
                    {/* A LISTA DE JOGOS (Agora mostrando 'currentGames' e não todos) */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: '1fr 1fr',
                                md: 'repeat(4, 1fr)',
                                lg: 'repeat(4, 1fr)'
                            },
                            gap: 3,
                            width: '100%',
                        }}
                    >
                        {currentGames.map((game) => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </Box>

                    {/* O COMPONENTE DE PAGINAÇÃO */}
                    {totalPages > 1 && (
                        <Stack spacing={2} alignItems="center" sx={{ mt: 2 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                                showFirstButton
                                showLastButton
                            />
                            <Typography variant="caption" color="text.secondary">
                                Mostrando {startIndex + 1}-{Math.min(endIndex, filteredGames.length)} de {filteredGames.length} jogos
                            </Typography>
                        </Stack>
                    )}
                </>
            )}
        </Box>
    );
};

export default GameList;