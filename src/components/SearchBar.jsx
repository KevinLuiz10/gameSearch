import React, { useState, useEffect } from 'react';
import { Box, TextField, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ onSearch }) => {
    const [inputText, setInputText] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        //Temporizador (timer) que vai rodar daqui a 1 segundo
        const timerDeBusca = setTimeout(() => {

            onSearch(inputText);

        }, 1000);

        // Se o usuário digitar qualquer tecla antes do tempo acabar,
        // a linha abaixo cancela o timer anterior.
        return () => clearTimeout(timerDeBusca);

    }, [inputText, onSearch]); // Esse efeito roda toda vez que 'inputText' muda


    const handleSearchClick = () => {
        setError(false);
        onSearch(inputText);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSearchClick();
    };

    const handleInputChange = (e) => {
        const texto = e.target.value;
        setInputText(texto);
        if (error) setError(false);
    };

    return (
        <Box sx={{ mt: 4, mb: 4, width: '100%' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                    fullWidth
                    label="Pesquisar jogo..."
                    variant="outlined"
                    value={inputText}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    error={error}
                    helperText={error ? "Digite algo para buscar." : ""}
                />

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<SearchIcon />}
                    onClick={handleSearchClick}
                    sx={{ height: 56 }}
                >
                    Buscar
                </Button>

                {inputText && (
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => {
                            setInputText('');
                            onSearch('');
                        }}
                        sx={{ height: 56 }}
                    >
                        Limpar
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default SearchBar;