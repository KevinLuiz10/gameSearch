import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

const Header = () => {
    return (
        <AppBar position="static">
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <SportsEsportsIcon sx={{ mr: 2 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: '.1rem' }}
                    >
                        GAME SEARCH
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;