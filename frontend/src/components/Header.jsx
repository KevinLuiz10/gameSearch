import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../contexts/AuthContext.jsx'; // Importa o hook de Auth

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <AppBar position="static">
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    {/* LOGO E TÍTULO */}
                    <SportsEsportsIcon sx={{ mr: 2 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: '.1rem' }}
                    >
                        GAME SEARCH
                    </Typography>

                    {/* ÁREA DO USUÁRIO (Só mostra se estiver logado) */}
                    {user && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                            {/* Nome do Usuário */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AccountCircleIcon />
                                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                    Olá, {user.username}
                                </Typography>
                            </Box>

                            {/* Botão de Sair */}
                            <Button
                                color="inherit"
                                variant="outlined"
                                size="small"
                                onClick={logout}
                                startIcon={<LogoutIcon />}
                                sx={{
                                    borderColor: 'rgba(255,255,255,0.5)',
                                    '&:hover': {
                                        borderColor: '#fff',
                                        backgroundColor: 'rgba(255,255,255,0.1)'
                                    }
                                }}
                            >
                                Sair
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;