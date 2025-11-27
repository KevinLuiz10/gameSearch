import React, { useState, useContext, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    InputAdornment,
    Collapse,
    Paper,
    Typography,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Chip,
    ClickAwayListener
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';
import { GameContext } from '../contexts/GameContext';

const CATEGORIES = [
    "shooter", "mmorpg", "strategy", "moba", "racing", "sports",
    "social", "sandbox", "open-world", "survival", "pvp", "pve", "pixel",
    "zombie", "turn-based", "first-person", "third-person", "top-down",
    "tank", "space", "sailing", "side-scroller", "superhero", "permadeath",
    "card", "battle-royale", "mmo", "mmofps", "mmotps", "3d", "2d",
    "anime", "fantasy", "sci-fi", "fighting", "action-rpg", "action",
    "military", "martial-arts", "flight", "low-spec", "tower-defense",
    "horror", "mmorts"
];

const SearchBar = ({ onSearch }) => {
    const [inputText, setInputText] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [error, setError] = useState(false);

    const [selectedCategories, setSelectedCategories] = useState([]);

    const { applyFilter } = useContext(GameContext);

    useEffect(() => {
        const timerDeBusca = setTimeout(() => {
            onSearch(inputText);
        }, 1000);
        return () => clearTimeout(timerDeBusca);
    }, [inputText, onSearch]);

    const handleSearchClick = () => {
        setError(false);
        onSearch(inputText);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSearchClick();
    };

    const handleCategoryChange = (category) => {
        let newSelection = [...selectedCategories];

        if (newSelection.includes(category)) {
            newSelection = newSelection.filter(c => c !== category);
        } else {
            newSelection.push(category);
        }

        setSelectedCategories(newSelection);
        applyFilter(newSelection);
    };

    return (
        <ClickAwayListener onClickAway={() => setShowFilter(false)}>
            <Box sx={{ mt: 4, mb: 4, width: '100%' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        fullWidth
                        label="Pesquisar jogo..."
                        variant="outlined"
                        value={inputText}
                        onChange={(e) => {
                            setInputText(e.target.value);
                            setError(false);
                        }}
                        onKeyPress={handleKeyPress}
                        error={error}
                        helperText={error ? "Digite algo para buscar." : ""}

                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button
                                        onClick={() => setShowFilter(!showFilter)}
                                        startIcon={<FilterListIcon />}
                                        sx={{
                                            textTransform: 'none',
                                            color: showFilter || selectedCategories.length > 0 ? 'primary.main' : 'text.secondary',
                                            fontWeight: selectedCategories.length > 0 ? 'bold' : 'normal'
                                        }}
                                    >
                                        {selectedCategories.length === 0
                                            ? "Filtrar"
                                            : `Filtros (${selectedCategories.length})`}
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
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
                </Box>

                <Collapse in={showFilter}>
                    <Paper elevation={3} sx={{ mt: 2, p: 3, bgcolor: '#fff' }}>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                Selecione as categorias:
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Nenhuma selecionada = Mostrando todos os jogos
                            </Typography>
                        </Box>

                        <FormGroup row sx={{ maxHeight: '250px', overflowY: 'auto', pl: 1 }}>
                            {CATEGORIES.map((cat) => (
                                <FormControlLabel
                                    key={cat}
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={selectedCategories.includes(cat)}
                                            onChange={() => handleCategoryChange(cat)}
                                        />
                                    }
                                    label={cat.toUpperCase()}
                                    sx={{
                                        width: { xs: '100%', sm: '45%', md: '30%', lg: '19%' },
                                        '& .MuiTypography-root': { fontSize: '0.875rem' }
                                    }}
                                />
                            ))}
                        </FormGroup>


                        {selectedCategories.length > 0 && (
                            <Box sx={{
                                mt: 2,
                                pt: 2,
                                borderTop: '1px solid #eee',
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1,
                                alignItems: 'center'
                            }}>
                                <Typography variant="caption" sx={{ width: '100%', mb: 1 }}>Filtros ativos:</Typography>

                                {selectedCategories.map(cat => (
                                    <Chip
                                        key={cat}
                                        label={cat.toUpperCase()}
                                        onDelete={() => handleCategoryChange(cat)}
                                        color="primary"
                                        size="small"
                                    />
                                ))}


                                <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => {
                                        setSelectedCategories([]);
                                        applyFilter([]);
                                    }}
                                    sx={{
                                        textTransform: 'none',
                                        height: 24,
                                        fontSize: '0.8125rem'
                                    }}
                                >
                                    Limpar Tudo
                                </Button>

                            </Box>
                        )}

                    </Paper>
                </Collapse>
            </Box>
        </ClickAwayListener>
    );
};

export default SearchBar;