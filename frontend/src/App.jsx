import React, { useState, useContext } from 'react';
import { CssBaseline, Box, Container, CircularProgress } from '@mui/material';

// Imports de Contexto
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';

// Imports de Componentes
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import GameList from './components/GameList';
import Login from './components/Login';

// Criamos um componente interno para gerenciar a lógica de exibição
// (Precisamos separar porque só podemos usar o useContext DENTRO do AuthProvider)
const MainContent = () => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');

    // 1. Enquanto verifica se tem token salvo no navegador, mostra carregamento
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // 2. Se NÃO estiver autenticado, mostra a tela de Login
    if (!isAuthenticated) {
        return <Login />;
    }

    // 3. Se estiver autenticado, mostra o sistema principal (Jogos)
    return (
        <GameProvider>
            <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', pb: 4 }}>
                <Header />

                {/* Container XL para aproveitar telas grandes (1920x1080) */}
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