import React, { useState, useContext } from 'react';
import { CssBaseline, Box, Container, CircularProgress } from '@mui/material';

// Contextos
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';

// Componentes
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import GameList from './components/GameList';
import Login from './components/Login';


const MainContent = () => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Se NÃO estiver autenticado, mostra a tela de Login
    if (!isAuthenticated) {
        return <Login />;
    }

    // Se estiver autenticado, mostra o sistema principal
    return (
        <GameProvider>
            <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 4 }}>
                <Header />

                <Container maxWidth="xl">
                    <SearchBar onSearch={setSearchTerm} />
                    <GameList searchTerm={searchTerm} />
                </Container>
            </Box>
        </GameProvider>
    );
};

function App() {
    return (
        <AuthProvider>
            <CssBaseline />
            <MainContent />
        </AuthProvider>
    );
}

export default App;