import React, { useState } from 'react';
import { CssBaseline, Box, Container } from '@mui/material';

import { GameProvider } from './contexts/GameContext';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import GameList from './components/GameList';

function App() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <GameProvider>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 4 }}>

                <Header />

                <Container maxWidth="xl">

                    <SearchBar onSearch={setSearchTerm} />
                    <GameList searchTerm={searchTerm} />

                </Container>

            </Box>
        </GameProvider>
    );
}

export default App;