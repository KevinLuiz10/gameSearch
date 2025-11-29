import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext.jsx';
import GameCard from './GameCard.jsx';
import { Typography, CircularProgress, Box, Pagination, Stack } from '@mui/material';

const GameList = ({ searchTerm }) => {
    const { games, loading, error, fetchGames } = useGame();

    // --- CONFIGURAÇÃO DA PAGINAÇÃO ---
    const ITEMS_PER_PAGE = 12;
    const [page, setPage] = useState(1);

    useEffect(() => {
        // Debounce: Espera o usuário parar de digitar por 500ms antes de chamar o servidor
        const timer = setTimeout(() => {
            fetchGames(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);


    const displayGames = games || [];

    // --- EFEITO: RESETAR PÁGINA ---
    useEffect(() => {
        setPage(1);
    }, [searchTerm]);


    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentGames = displayGames.slice(startIndex, endIndex);

    const totalPages = Math.ceil(displayGames.length / ITEMS_PER_PAGE);

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Mostra loading enquanto o backend (ou redis) não responde
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

            {displayGames.length === 0 ? (
                <Typography variant="h6" align="center" color="textSecondary" sx={{ mt: 5 }}>
                    Nenhum jogo encontrado para "{searchTerm}".
                </Typography>
            ) : (
                <>
                    {/* A LISTA DE JOGOS */}
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
                                Mostrando {startIndex + 1}-{Math.min(endIndex, displayGames.length)} de {displayGames.length} jogos
                            </Typography>
                        </Stack>
                    )}
                </>
            )}
        </Box>
    );
};

export default GameList;