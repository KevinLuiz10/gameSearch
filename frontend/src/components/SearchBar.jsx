import React, { useState, useEffect } from 'react';
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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Ícone para o botão cadastrar

// Importações dos nossos componentes e contextos
import { useGame } from '../contexts/GameContext.jsx';
import AddGameForm from './AddGameForm.jsx';

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

const SearchBar = () => {
    const [inputText, setInputText] = useState('');

    const [showFilter, setShowFilter] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    const [error, setError] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const { fetchGames } = useGame();


    useEffect(() => {
        const timerDeBusca = setTimeout(() => {
            const categoryQuery = selectedCategories.length > 0 ? selectedCategories.join(',') : '';
            console.log(`📡 Buscando: "${inputText}" [Categorias: ${categoryQuery || 'Todas'}]`);
            fetchGames(inputText, categoryQuery);
        }, 1000);

        return () => clearTimeout(timerDeBusca);
    }, [inputText, selectedCategories]);

    const handleSearchClick = () => {
        setError(false);
        const categoryQuery = selectedCategories.length > 0 ? selectedCategories.join(',') : '';
        fetchGames(inputText, categoryQuery);
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
    };

    const toggleFilter = () => {
        if (showAddForm) setShowAddForm(false);
        setShowFilter(!showFilter);
    };

    const toggleAddForm = () => {
        if (showFilter) setShowFilter(false);
        setShowAddForm(!showAddForm);
    };

    const closeAll = () => {
        setShowFilter(false);
        setShowAddForm(false);
    };

    return (
        <ClickAwayListener onClickAway={closeAll}>
            <Box sx={{ mt: 4, mb: 4, width: '100%' }}>

                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
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
                                        onClick={toggleFilter}
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

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<SearchIcon />}
                            onClick={handleSearchClick}
                            sx={{ height: 56, minWidth: 120 }}
                        >
                            Buscar
                        </Button>


                        <Button
                            variant="outlined"
                            size="large"
                            color={showAddForm ? "success" : "primary"}
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={toggleAddForm}
                            sx={{
                                height: 56,
                                minWidth: 140,
                                borderWidth: showAddForm ? 2 : 1,
                                fontWeight: showAddForm ? 'bold' : 'normal'
                            }}
                        >
                            {showAddForm ? "Fechar" : "Cadastrar"}
                        </Button>
                    </Box>
                </Box>

                {/* FILTROS DE CATEGORIA */}
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
                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee', display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                                <Typography variant="caption" sx={{ width: '100%', mb: 1 }}>Filtros ativos:</Typography>
                                {selectedCategories.map(cat => (
                                    <Chip key={cat} label={cat.toUpperCase()} onDelete={() => handleCategoryChange(cat)} color="primary" size="small" />
                                ))}
                                <Button
                                    variant="outlined" color="error" size="small" startIcon={<DeleteIcon />}
                                    onClick={() => setSelectedCategories([])}
                                    sx={{ textTransform: 'none', height: 24, fontSize: '0.8125rem' }}
                                >
                                    Limpar Tudo
                                </Button>
                            </Box>
                        )}
                    </Paper>
                </Collapse>

                {/* FORMULÁRIO DE CADASTRO DE NOVO JOGO */}
                <Collapse in={showAddForm}>
                    <AddGameForm onSuccess={() => setShowAddForm(false)} />
                </Collapse>

            </Box>
        </ClickAwayListener>
    );
};

export default SearchBar;